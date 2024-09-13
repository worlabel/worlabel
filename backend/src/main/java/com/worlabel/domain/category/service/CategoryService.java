package com.worlabel.domain.category.service;

import com.worlabel.domain.category.entity.LabelCategory;
import com.worlabel.domain.category.entity.dto.CategoryRequest;
import com.worlabel.domain.category.entity.dto.CategoryResponse;
import com.worlabel.domain.category.repository.CategoryRepository;
import com.worlabel.domain.participant.service.ParticipantService;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.service.ProjectService;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ParticipantService participantService;
    private final ProjectService projectService;

    public CategoryResponse createCategory(final Integer memberId, final Integer projectId, final CategoryRequest categoryRequest) {
        participantService.checkEditorUnauthorized(memberId, projectId);

        // 이미 존재하는지 확인 있다면 예외
        if (categoryRepository.existsByName(categoryRequest.getCategoryName())) {
            throw new CustomException(ErrorCode.PROJECT_CATEGORY_EXIST);
        }

        Project project = projectService.getProject(projectId);

        LabelCategory labelCategory = LabelCategory.of(categoryRequest.getCategoryName(), project);
        categoryRepository.save(labelCategory);

        return CategoryResponse.from(labelCategory);
    }

    public void deleteCategory(final int memberId, final int  projectId, final int categoryId) {
        participantService.checkEditorUnauthorized(memberId, projectId);
        LabelCategory category = getCategory(categoryId);
        categoryRepository.delete(category);
    }

    public CategoryResponse getCategoryById(final int memberId, final int projectId, final int categoryId){
        participantService.checkViewerUnauthorized(memberId,projectId);
        return CategoryResponse.from(getCategory(categoryId));
    }

    private LabelCategory getCategory(final Integer categoryId) {
        return categoryRepository.findById(categoryId).orElseThrow(() ->new CustomException(ErrorCode.PROJECT_CATEGORY_NOT_FOUND));
    }

}
