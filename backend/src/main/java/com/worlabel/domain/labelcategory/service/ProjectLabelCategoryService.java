package com.worlabel.domain.labelcategory.service;

import com.worlabel.domain.labelcategory.entity.ProjectCategory;
import com.worlabel.domain.labelcategory.entity.dto.CategoryResponse;
import com.worlabel.domain.labelcategory.repository.ProjectLabelCategoryRepository;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.global.annotation.CheckPrivilege;
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

    @CheckPrivilege(PrivilegeType.VIEWER)
    public List<CategoryResponse> getCategoryById(final int projectId) {
        List<ProjectCategory> categories = projectLabelCategoryRepository.findAllByProjectId(projectId);

        return categories.stream()
                .map(category -> CategoryResponse.of(category.getId(), category.getLabelName()))
                .toList();
    }
}
