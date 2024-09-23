package com.worlabel.domain.model.service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.entity.LabelStatus;
import com.worlabel.domain.image.repository.ImageRepository;
import com.worlabel.domain.labelcategory.entity.LabelCategory;
import com.worlabel.domain.labelcategory.entity.dto.DefaultLabelCategoryResponse;
import com.worlabel.domain.labelcategory.entity.dto.LabelCategoryResponse;
import com.worlabel.domain.labelcategory.repository.LabelCategoryRepository;
import com.worlabel.domain.model.entity.AiModel;
import com.worlabel.domain.model.entity.dto.AiModelRequest;
import com.worlabel.domain.model.entity.dto.AiModelResponse;
import com.worlabel.domain.model.entity.dto.DefaultAiModelResponse;
import com.worlabel.domain.model.entity.dto.DefaultResponse;
import com.worlabel.domain.model.repository.AiModelRepository;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.domain.project.dto.AiDto;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.repository.ProjectRepository;
import com.worlabel.global.annotation.CheckPrivilege;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.service.AiRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AiModelService {

    private final AiModelRepository aiModelRepository;
    private final ProjectRepository projectRepository;
    private final LabelCategoryRepository labelCategoryRepository;
    private final ImageRepository imageRepository;
    private final AiRequestService aiRequestService;
    private final Gson gson;

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
        return aiModelRepository.findAllByProjectId(projectId)
            .stream()
            .map(AiModelResponse::of)
            .toList();
    }

    @CheckPrivilege(PrivilegeType.EDITOR)
    public void addModel(final Integer memberId, final Integer projectId, final AiModelRequest aiModelRequest) {
        Project project = getProject(projectId);
        AiModel aiModel = AiModel.of(aiModelRequest.getName(), project);

        aiModelRepository.save(aiModel);
    }

    @CheckPrivilege(PrivilegeType.EDITOR)
    public void renameModel(final Integer memberId, final Integer projectId, final int modelId, final AiModelRequest aiModelRequest) {
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
    public void train(Integer memberId, Integer projectId, Integer modelId) {
        // TODO: 레디스 train 테이블에 존재하는지 확인 -> 이미 있으면 있다고 예외를 던져준다. -> 용수 추후 구현 예정
        /*
            없으면 redis 상태 테이블을 만든다. progressTable
         */

        // FastAPI 서버로 학습 요청을 전송
        Project project = getProject(projectId);
        AiModel model = getModel(modelId);
        List<LabelCategory> labelCategories = labelCategoryRepository.findAllByModelId(modelId);
        List<Integer> categories = labelCategories.stream()
            .map(LabelCategory::getAiCategoryId).toList();

        List<Image> images = imageRepository.findImagesByProjectId(projectId);

        List<AiDto.TrainDataInfo> data = images.stream().filter(image -> image.getStatus() == LabelStatus.COMPLETED)
            .map(image -> new AiDto.TrainDataInfo(image.getImagePath(), image.getDataPath()))
            .toList();

        String endPoint = project.getProjectType().getValue() + "/train";

        AiDto.TrainRequest trainRequest = new AiDto.TrainRequest();
        trainRequest.setProjectId(projectId);
        trainRequest.setCategoryId(categories);
        trainRequest.setData(data);
        trainRequest.setModelKey(model.getModelKey());

        // FastAPI 서버로 POST 요청 전송
        String modelKey = aiRequestService.postRequest(endPoint, trainRequest, String.class, response -> response);

        // 가져온 modelKey -> version 업된 모델 다시 새롭게 저장
        String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        AiModel newModel = AiModel.of(currentDateTime, modelKey, model.getVersion() + 1, project);
        aiModelRepository.save(newModel);
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
            log.debug("TODO: 추후 리팩토링 해야함 이건 예시");
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
