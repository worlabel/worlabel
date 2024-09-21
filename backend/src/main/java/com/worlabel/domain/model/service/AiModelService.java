package com.worlabel.domain.model.service;


import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.worlabel.domain.labelcategory.entity.LabelCategory;
import com.worlabel.domain.labelcategory.entity.dto.LabelCategoryResponse;
import com.worlabel.domain.labelcategory.repository.LabelCategoryRepository;
import com.worlabel.domain.model.entity.AiModel;
import com.worlabel.domain.model.entity.dto.AiModelRequest;
import com.worlabel.domain.model.entity.dto.AiModelResponse;
import com.worlabel.domain.model.entity.dto.DefaultResponse;
import com.worlabel.domain.model.repository.AiModelRepository;
import com.worlabel.domain.participant.entity.PrivilegeType;
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
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AiModelService {

    private final AiModelRepository aiModelRepository;
    private final ProjectRepository projectRepository;
    private final LabelCategoryRepository labelCategoryRepository;
    private final AiRequestService aiRequestService;
    private final Gson gson;

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

    /**
     * 해당 Default 모델 불러오기 API 예시
     */
    // TODO : 스프링이 로딩 후 DefaultModel을 불러온다.
    public void loadDefaultModel() {
        String url = "model/default";
        List<DefaultResponse> defaultResponseList = aiRequestService.getRequest(url, this::converter);

        // TODO: defaultModel 현재 DB에 해당하는지 안하는지 확인하기

        // TODO : 1.DefaultResponse의 Key값만 모아서 리스트로 만든다.

        // TODO: 2. 그 중 IN(key...)로 해당되는 Key값 확인하기

        // TODO: 3. 현재 DB에 없는 Key만 모아서 DB와 CategoryList에 넣어주면 됨
    }

    /**
     *  Json -> List<DefaultResponse>
     */
    // TODO: 추후 리팩토링 해야함 이건 예시
    private List<DefaultResponse> converter(String data) {
        try{
            Type listType = new TypeToken<List<DefaultResponse>>() {}.getType();
            return gson.fromJson(data, listType);
        }catch (Exception e){
            log.debug("TODO: 추후 리팩토링 해야함 이건 예시");
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }
    }

    private Project getProject(Integer projectId) {
        return projectRepository.findById(projectId).orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }

}
