package com.worlabel.domain.model.service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.entity.LabelStatus;
import com.worlabel.domain.image.repository.ImageRepository;
import com.worlabel.domain.labelcategory.entity.LabelCategory;
import com.worlabel.domain.labelcategory.entity.ProjectCategory;
import com.worlabel.domain.labelcategory.entity.dto.DefaultLabelCategoryResponse;
import com.worlabel.domain.labelcategory.entity.dto.LabelCategoryResponse;
import com.worlabel.domain.labelcategory.repository.LabelCategoryRepository;
import com.worlabel.domain.model.entity.AiModel;
import com.worlabel.domain.model.entity.dto.*;
import com.worlabel.domain.model.repository.AiModelRepository;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.domain.progress.service.ProgressService;
import com.worlabel.domain.project.dto.AiDto;
import com.worlabel.domain.project.dto.AiDto.TrainDataInfo;
import com.worlabel.domain.project.dto.AiDto.TrainRequest;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.repository.ProjectRepository;
import com.worlabel.domain.project.service.ProjectService;
import com.worlabel.domain.report.service.ReportService;
import com.worlabel.domain.result.entity.Result;
import com.worlabel.domain.result.repository.ResultRepository;
import com.worlabel.global.annotation.CheckPrivilege;
import com.worlabel.global.cache.CacheKey;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.service.AiRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AiModelService {

    private final LabelCategoryRepository labelCategoryRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final AiModelRepository aiModelRepository;
    private final ProjectRepository projectRepository;
    private final AiRequestService aiRequestService;
    private final ImageRepository imageRepository;
    private final ResultRepository resultRepository;
    private final ProjectService projectService;
    private final Gson gson;
    private final ProgressService progressService;
    private final ReportService reportService;

    //    @PostConstruct
    public void loadDefaultModel() {
        String url = "model/default";
        List<DefaultResponse> defaultResponseList = aiRequestService.getRequest(url, this::converter);

        // 1. DefaultResponse의 Key값만 모아서 리스트로 만든다.
        List<String> allModelKeys = defaultResponseList.stream()
                .map(response -> response.getDefaultAiModelResponse().getModelKey())
                .toList();

        // 2. 해당 Key값이 DB에 있는지 확인하기 (한 번의 쿼리로)
        List<String> existingModelKeys = aiModelRepository.findAllByModelKeyIn(allModelKeys).stream()
                .map(AiModel::getModelKey)
                .toList();

        // 3. DB에 없는 Key만 필터링해서 처리
        List<DefaultResponse> newModel = defaultResponseList.stream()
                .filter(model -> !existingModelKeys.contains(model.getDefaultAiModelResponse().getModelKey()))
                .toList();


        // 새롭게 추가된 값을 디비에 저장
        List<AiModel> aiModels = new ArrayList<>();
        List<LabelCategory> categories = new ArrayList<>();
        for (DefaultResponse defaultResponse : newModel) {
            DefaultAiModelResponse defaultAiModelResponse = defaultResponse.getDefaultAiModelResponse();
            AiModel newAiModel = AiModel.of(defaultAiModelResponse.getName(), defaultAiModelResponse.getModelKey(), 0, null);
            aiModels.add(newAiModel);

            List<DefaultLabelCategoryResponse> defaultLabelCategoryResponseList = defaultResponse.getDefaultLabelCategoryResponseList();

            for (DefaultLabelCategoryResponse categoryResponse : defaultLabelCategoryResponseList) {
                categories.add(LabelCategory.of(newAiModel, categoryResponse.getName(), categoryResponse.getAiId()));
            }
        }

        aiModelRepository.saveAll(aiModels);
        labelCategoryRepository.saveAll(categories);
    }

    @Transactional(readOnly = true)
    public List<AiModelResponse> getModelList(final Integer projectId) {
        int progressModelId = progressService.getProgressModelByProjectId(projectId);
        return aiModelRepository.findAllByProjectId(projectId)
                .stream()
                .map(o -> AiModelResponse.of(o, progressModelId))
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

    @Transactional(readOnly = true)
    public List<LabelCategoryResponse> getCategories(final Integer modelId) {
        List<LabelCategory> categoryList = labelCategoryRepository.findAllByModelId(modelId);
        return categoryList.stream()
                .map(LabelCategoryResponse::from)
                .toList();
    }

    @CheckPrivilege(PrivilegeType.EDITOR)
    public void train(final Integer projectId, final ModelTrainRequest trainRequest) {
        // FastAPI 서버로 학습 요청을 전송
        Project project = getProject(projectId);
        AiModel model = getModel(trainRequest.getModelId());

        Map<Integer, Integer> labelMap = project.getCategoryList().stream()
                .collect(Collectors.toMap(
                        category -> category.getLabelCategory().getId(),
                        ProjectCategory::getId
                ));

        List<Image> images = imageRepository.findImagesByProjectIdAndCompleted(projectId);

        List<TrainDataInfo> data = images.stream()
                .map(TrainDataInfo::of)
                .toList();

        TrainRequest aiRequest = TrainRequest.of(project.getId(), model.getId(), model.getModelKey(), labelMap, data, trainRequest);

        String endPoint = project.getProjectType().getValue() + "/train";

        // FastAPI 서버로 POST 요청 전송
        log.debug("요청 DTO :{}",aiRequest);
        TrainResponse trainResponse = aiRequestService.postRequest(endPoint, aiRequest, TrainResponse.class, this::converterTrain);

        // 가져온 modelKey -> version 업된 모델 다시 새롭게 저장
        String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmm"));
        int newVersion = model.getVersion() + 1;
        String newName = currentDateTime + String.format("%03d", newVersion);

        AiModel newModel = AiModel.of(newName, trainResponse.getModelKey(), newVersion, project);

        aiModelRepository.save(newModel);

        Result result = Result.of(newModel, trainResponse, trainRequest);

        resultRepository.save(result);

        // 레디스 정보 DB에 저장
        reportService.changeReport(project.getId(), model.getId(), newModel);
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

    /**
     * Json -> List<DefaultResponse>
     */
    // TODO: 추후 리팩토링 해야함 이건 예시
    private List<DefaultResponse> converter(String data) {
        try {
            Type listType = new TypeToken<List<DefaultResponse>>() {
            }.getType();
            return gson.fromJson(data, listType);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }
    }

    private Project getProject(Integer projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }

    private AiModel getModel(Integer modelId) {
        return aiModelRepository.findById(modelId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }
}
