package com.worlabel.domain.model.service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.worlabel.domain.alarm.entity.Alarm;
import com.worlabel.domain.alarm.service.AlarmService;
import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.repository.ImageRepository;
import com.worlabel.domain.labelcategory.entity.ProjectCategory;
import com.worlabel.domain.model.entity.AiModel;
import com.worlabel.domain.model.entity.dto.*;
import com.worlabel.domain.model.repository.AiModelRepository;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.domain.progress.service.ProgressService;
import com.worlabel.domain.project.dto.AiDto.TrainDataInfo;
import com.worlabel.domain.project.dto.AiDto.TrainRequest;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.repository.ProjectRepository;
import com.worlabel.domain.project.service.ProjectService;
import com.worlabel.domain.report.service.ReportService;
import com.worlabel.domain.result.entity.Result;
import com.worlabel.domain.result.repository.ResultRepository;
import com.worlabel.global.annotation.CheckPrivilege;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.service.AiRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AiModelService {

    private final AiModelRepository aiModelRepository;
    private final ProjectRepository projectRepository;
    private final ResultRepository resultRepository;
    private final AiRequestService aiRequestService;
    private final ProgressService progressService;
    private final ImageRepository imageRepository;
    private final ReportService reportService;
    private final AlarmService alarmService;

    private final Gson gson;

    @Transactional(readOnly = true)
    public List<AiModelResponse> getModelList(final Integer projectId) {
        Project project = getProject(projectId);
        int progressModelId = progressService.getProgressModelByProjectId(projectId);
        log.debug("진행 중 modelId{} {} ",progressModelId, projectId);
        return aiModelRepository.findAllByProjectId(projectId)
                .stream()
                .map(o -> AiModelResponse.of(o, progressModelId, project.getProjectType()))
                .toList();
    }

    @CheckPrivilege(PrivilegeType.EDITOR)
    public void addModel(final Integer projectId, final AiModelRequest aiModelRequest) {
        Project project = getProject(projectId);
        AiModel aiModel = AiModel.of(aiModelRequest.getName(), project);

        aiModelRepository.save(aiModel);
    }

    @CheckPrivilege(PrivilegeType.EDITOR)
    public void renameModel(final Integer projectId, final int modelId, final AiModelRequest aiModelRequest) {
        AiModel customModel = getCustomModel(modelId);
        customModel.rename(aiModelRequest.getName());

        aiModelRepository.save(customModel);
    }

    private AiModel getCustomModel(int modelId) {
        return aiModelRepository.findCustomModelById(modelId).orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));
    }

    @CheckPrivilege(PrivilegeType.EDITOR)
    public void train(final Integer memberId, final Integer projectId, final ModelTrainRequest trainRequest) {
        progressService.trainProgressCheck(projectId);

        try {
            // 학습 상황 등록
            progressService.registerTrainProcess(projectId, trainRequest.getModelId());

            Project project = getProject(projectId);
            AiModel model = getModel(trainRequest.getModelId());

            TrainRequest aiRequest = getTrainRequest(trainRequest, project, model);

            // FastAPI 서버로 POST 요청 전송
            log.debug("요청 DTO :{}", aiRequest);
            String endPoint = project.getProjectType().getValue() + "/train";
            TrainResponse trainResponse = aiRequestService.postRequest(endPoint, aiRequest, TrainResponse.class, this::converterTrain);
            log.debug("결과 {}",trainResponse);

            // 가져온 modelKey -> version 업된 모델 다시 새롭게 저장
            String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmm"));
            int newVersion = model.getVersion() + 1;
            String newName = currentDateTime + String.format("%03d", newVersion);

            // 새로운 모델 저장
            AiModel newModel = AiModel.of(newName, trainResponse.getModelKey(), newVersion, project);
            aiModelRepository.save(newModel);

            // 결과 저장
            Result result = Result.of(newModel, trainResponse, trainRequest);
            resultRepository.save(result);

            // 레디스 정보 DB에 저장
            reportService.changeReport(project.getId(), model.getId(), newModel);

            // 알람 전송
            alarmService.save(memberId, Alarm.AlarmType.TRAIN);
        } finally {
            progressService.removeTrainProgress(projectId);
        }
    }

    @CheckPrivilege(PrivilegeType.EDITOR)
    public ResponseEntity<Resource> modelDownload(final Integer projectId,final Integer modelId) {
        AiModel model = getModel(modelId);
        String modelKey = model.getModelKey();

        String endPoint = "/models/download";
        endPoint += "?modelKey=" + modelKey;

        return aiRequestService.getFileRequest(endPoint);
    }

    public TrainRequest getTrainRequest(final ModelTrainRequest trainRequest, final Project project, final AiModel model) {
        Map<String, Integer> labelMap = getLabelMap(project);
        List<TrainDataInfo> data = getTrainDataInfoList(project.getId());
        return TrainRequest.of(project.getId(), model.getId(), model.getModelKey(), labelMap, data, trainRequest);
    }

    // 레이블 맵 만들기
    private Map<String, Integer> getLabelMap(final Project project) {
        return project.getCategoryList().stream()
                .collect(Collectors.toMap(
                        ProjectCategory::getLabelName,
                        ProjectCategory::getId
                ));
    }

    @Transactional(readOnly = true)
    public List<TrainDataInfo> getTrainDataInfoList(final Integer projectId) {
        return imageRepository.findImagesByProjectIdAndCompleted(projectId)
                .stream()
                .map(TrainDataInfo::of)
                .toList();
    }

    private Project getProject(Integer projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }

    private AiModel getModel(Integer modelId) {
        return aiModelRepository.findById(modelId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }

    private TrainResponse converterTrain(String data) {
        try {
            Type type = new TypeToken<TrainResponse>() {
            }.getType();
            return gson.fromJson(data, type);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }
    }

}
