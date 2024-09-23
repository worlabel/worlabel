package com.worlabel.domain.labelcategory.service;

import com.worlabel.domain.labelcategory.entity.LabelCategory;
import com.worlabel.domain.labelcategory.entity.ProjectCategory;
import com.worlabel.domain.labelcategory.entity.dto.LabelCategoryRequest;
import com.worlabel.domain.labelcategory.entity.dto.LabelCategoryResponse;
import com.worlabel.domain.labelcategory.repository.LabelCategoryRepository;
import com.worlabel.domain.labelcategory.repository.ProjectLabelCategoryRepository;
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
public class ProjectLabelCategoryService {

    private final ProjectLabelCategoryRepository projectLabelCategoryRepository;
    private final LabelCategoryRepository labelCategoryRepository;
    private final ProjectRepository projectRepository;

    @CheckPrivilege(PrivilegeType.EDITOR)
    public void createCategory(final Integer memberId, final Integer projectId, final LabelCategoryRequest categoryRequest) {
        Project project = getProject(projectId);
        List<LabelCategory> labelCategoryList = labelCategoryRepository.findAllByIdsAndModelId(categoryRequest.getLabelCategoryList(), categoryRequest.getModelId());
        List<ProjectCategory> projectCategoryList = labelCategoryList.stream().map(o -> ProjectCategory.of(o, project)).toList();
        projectLabelCategoryRepository.saveAll(projectCategoryList);
    }

    @CheckPrivilege(PrivilegeType.EDITOR)
    public void deleteCategory(final int memberId, final int projectId, final int projectCategoryId) {
        ProjectCategory projectCategory = getProjectCategory(projectCategoryId);
        projectLabelCategoryRepository.delete(projectCategory);
    }

    @CheckPrivilege(PrivilegeType.VIEWER)
    public LabelCategoryResponse getCategoryById(final int memberId, final int projectId, final int categoryId) {
        return LabelCategoryResponse.from(getProjectCategory(categoryId).getLabelCategory());
    }

    public boolean existByCategoryName(final int projectId, final String categoryName) {
        return projectLabelCategoryRepository.existsByNameAndProjectId(categoryName, projectId);
    }

    @CheckPrivilege(PrivilegeType.VIEWER)
    public List<LabelCategoryResponse> getCategoryList(final Integer memberId, final Integer projectId) {
        return projectLabelCategoryRepository.findAllByProjectId(projectId)
                .stream()
                .map(ProjectCategory::getLabelCategory)
                .map(LabelCategoryResponse::from)
                .toList();
    }

    private Project getProject(Integer projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }

    private ProjectCategory getProjectCategory(final Integer categoryId) {
        return projectLabelCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }
}
