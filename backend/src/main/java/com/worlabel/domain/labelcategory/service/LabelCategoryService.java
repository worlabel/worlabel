package com.worlabel.domain.labelcategory.service;

import com.worlabel.domain.labelcategory.entity.LabelCategory;
import com.worlabel.domain.labelcategory.entity.dto.LabelCategoryRequest;
import com.worlabel.domain.labelcategory.entity.dto.LabelCategoryResponse;
import com.worlabel.domain.labelcategory.repository.LabelCategoryRepository;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.domain.participant.service.ParticipantService;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.service.ProjectService;
import com.worlabel.global.annotation.CheckPrivilege;
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
    private final ProjectService projectService;

    @CheckPrivilege(PrivilegeType.EDITOR)
    public LabelCategoryResponse createCategory(final Integer memberId, final Integer projectId, final LabelCategoryRequest categoryRequest) {
        // 이미 존재하는지 확인 있다면 예외
        if (labelCategoryRepository.existsByNameAndProjectId(categoryRequest.getCategoryName(), projectId)) {
            throw new CustomException(ErrorCode.PROJECT_CATEGORY_EXIST);
        }

        Project project = projectService.getProject(projectId);

        LabelCategory labelCategory = LabelCategory.of(categoryRequest.getCategoryName(), project);
        labelCategoryRepository.save(labelCategory);

        return LabelCategoryResponse.from(labelCategory);
    }

    @CheckPrivilege(PrivilegeType.EDITOR)
    public void deleteCategory(final int memberId, final int projectId, final int categoryId) {
        LabelCategory category = getCategory(categoryId);
        labelCategoryRepository.delete(category);
    }

    @CheckPrivilege(PrivilegeType.VIEWER)
    public LabelCategoryResponse getCategoryById(final int memberId, final int projectId, final int categoryId) {
        return LabelCategoryResponse.from(getCategory(categoryId));
    }

    @CheckPrivilege(PrivilegeType.VIEWER)
    public boolean existByCategoryName(final int memberId, final int projectId, final String categoryName) {
        return labelCategoryRepository.existsByNameAndProjectId(categoryName, projectId);
    }

    @CheckPrivilege(PrivilegeType.VIEWER)
    public List<LabelCategoryResponse> getCategoryList(final Integer memberId, final Integer projectId) {
        List<LabelCategory> labelCategoryList = labelCategoryRepository.findAllByProjectId(projectId);
        return labelCategoryList.stream().map(LabelCategoryResponse::from).toList();
    }

    private LabelCategory getCategory(final Integer categoryId) {
        return labelCategoryRepository.findById(categoryId).orElseThrow(() -> new CustomException(ErrorCode.PROJECT_CATEGORY_NOT_FOUND));
    }
}
