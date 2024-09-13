package com.worlabel.domain.labelcategory.service;

import com.worlabel.domain.labelcategory.entity.LabelCategory;
import com.worlabel.domain.labelcategory.entity.dto.LabelCategoryRequest;
import com.worlabel.domain.labelcategory.entity.dto.LabelCategoryResponse;
import com.worlabel.domain.labelcategory.repository.LabelCategoryRepository;
import com.worlabel.domain.participant.service.ParticipantService;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.service.ProjectService;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class LabelCategoryService {

    private final LabelCategoryRepository labelCategoryRepository;
    private final ParticipantService participantService;
    private final ProjectService projectService;

    public LabelCategoryResponse createCategory(final Integer memberId, final Integer projectId, final LabelCategoryRequest categoryRequest) {
        participantService.checkEditorUnauthorized(memberId, projectId);

        // 이미 존재하는지 확인 있다면 예외
        if (labelCategoryRepository.existsByNameAndProjectId(categoryRequest.getCategoryName(), projectId)) {
            throw new CustomException(ErrorCode.PROJECT_CATEGORY_EXIST);
        }

        Project project = projectService.getProject(projectId);

        LabelCategory labelCategory = LabelCategory.of(categoryRequest.getCategoryName(), project);
        labelCategoryRepository.save(labelCategory);

        return LabelCategoryResponse.from(labelCategory);
    }

    public void deleteCategory(final int memberId, final int projectId, final int categoryId) {
        participantService.checkEditorUnauthorized(memberId, projectId);
        LabelCategory category = getCategory(categoryId);
        labelCategoryRepository.delete(category);
    }

    public LabelCategoryResponse getCategoryById(final int memberId, final int projectId, final int categoryId) {
        participantService.checkViewerUnauthorized(memberId, projectId);
        return LabelCategoryResponse.from(getCategory(categoryId));
    }

    public boolean existByCategoryName(final int memberId, final int projectId, final String categoryName) {
        participantService.checkViewerUnauthorized(memberId, projectId);
        return labelCategoryRepository.existsByNameAndProjectId(categoryName, projectId);
    }

    public List<LabelCategoryResponse> getCategoryList(final Integer memberId, final Integer projectId) {
        participantService.checkViewerUnauthorized(memberId, projectId);
        List<LabelCategory> labelCategoryList = labelCategoryRepository.findAllByProjectId(projectId);
        return labelCategoryList.stream().map(LabelCategoryResponse::from).toList();
    }

    private LabelCategory getCategory(final Integer categoryId) {
        return labelCategoryRepository.findById(categoryId).orElseThrow(() -> new CustomException(ErrorCode.PROJECT_CATEGORY_NOT_FOUND));
    }

}
