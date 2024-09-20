package com.worlabel.domain.model.service;


import com.worlabel.domain.labelcategory.entity.LabelCategory;
import com.worlabel.domain.labelcategory.entity.dto.LabelCategoryResponse;
import com.worlabel.domain.labelcategory.repository.LabelCategoryRepository;
import com.worlabel.domain.model.entity.AiModel;
import com.worlabel.domain.model.entity.dto.AiModelRequest;
import com.worlabel.domain.model.entity.dto.AiModelResponse;
import com.worlabel.domain.model.repository.AiModelRepository;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.repository.ProjectRepository;
import com.worlabel.global.annotation.CheckPrivilege;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AiModelService {

    private final AiModelRepository aiModelRepository;
    private final ProjectRepository projectRepository;
    private final LabelCategoryRepository labelCategoryRepository;

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

    @Transactional(readOnly = true)
    public List<LabelCategoryResponse> getCategories(final Integer modelId) {
        List<LabelCategory> categoryList = labelCategoryRepository.findAllByModelId(modelId);
        return categoryList.stream()
                .map(LabelCategoryResponse::from)
                .toList();
    }

    private Project getProject(Integer projectId) {
        return projectRepository.findById(projectId).orElseThrow(()-> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }

}
