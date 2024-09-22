package com.worlabel.domain.labelcategory.service;

import com.worlabel.domain.labelcategory.entity.LabelCategory;
import com.worlabel.domain.labelcategory.entity.dto.LabelCategoryRequest;
import com.worlabel.domain.labelcategory.entity.dto.LabelCategoryResponse;
import com.worlabel.domain.labelcategory.repository.LabelCategoryRepository;
import com.worlabel.domain.labelcategory.repository.ProjectLabelCategoryRepository;
import com.worlabel.domain.participant.entity.PrivilegeType;
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
public class ProjectLabelCategoryService {

    private final ProjectLabelCategoryRepository projectLabelCategoryRepository;

    @CheckPrivilege(PrivilegeType.EDITOR)
    public LabelCategoryResponse createCategory(final Integer memberId, final Integer projectId, final LabelCategoryRequest categoryRequest) {
        // 해당 프로젝트에 이미 존재하는지 확인, 있다면 예외
        return null;
    }

    @CheckPrivilege(PrivilegeType.EDITOR)
    public void deleteCategory(final int memberId, final int projectId, final int categoryId) {
//        LabelCategory category = getCategory(categoryId);
//        labelCategoryRepository.delete(category);
    }

    @CheckPrivilege(PrivilegeType.VIEWER)
    public LabelCategoryResponse getCategoryById(final int memberId, final int projectId, final int categoryId) {
        return LabelCategoryResponse.from(getCategory(categoryId));
    }

    @CheckPrivilege(PrivilegeType.VIEWER)
    public boolean existByCategoryName(final int memberId, final int projectId, final String categoryName) {
//        return labelCategoryRepository.existsByNameAndProjectId(categoryName, projectId);
        return true;
    }

    @CheckPrivilege(PrivilegeType.VIEWER)
    public List<LabelCategoryResponse> getCategoryList(final Integer memberId, final Integer projectId) {
//        List<LabelCategory> labelCategoryList = labelCategoryRepository.findAllByProjectId(projectId);
//        return labelCategoryList.stream().map(LabelCategoryResponse::from).toList();
        return null;
    }

    private LabelCategory getCategory(final Integer categoryId) {
       return null;
    }
}
