package com.worlabel.domain.labelcategory.controller;

import com.worlabel.domain.labelcategory.entity.dto.LabelCategoryRequest;
import com.worlabel.domain.labelcategory.entity.dto.LabelCategoryResponse;
import com.worlabel.domain.labelcategory.service.ProjectLabelCategoryService;
import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "레이블 카테고리 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects/{project_id}/categories")
public class CategoryController {

    private final ProjectLabelCategoryService categoryService;

    @Operation(summary = "프로젝트 레이블 카테고리 선택", description = "프로젝트 레이블 카테고리를 추가합니다.")
    @SwaggerApiSuccess(description = "카테고리 성공적으로 추가합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PostMapping
    public void createFolder(
            @CurrentUser final Integer memberId,
            @RequestBody final LabelCategoryRequest categoryRequest) {
        categoryService.createCategory(memberId, categoryRequest);
    }

    @Operation(summary = "레이블 카테고리 존재 여부 조회", description = "해당 프로젝트에 같은 레이블 카테고리 이름이 있는지 조회합니다.")
    @SwaggerApiSuccess(description = "카테고리 존재 여부를 조회합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @GetMapping("/exist")
    public boolean existByCategoryName(
            @PathVariable("project_id") final Integer projectId,
            @Param("categoryName") final String categoryName) {
        return categoryService.existByCategoryName(projectId, categoryName);
    }

    @Operation(summary = "프로젝트 레이블 카테고리 리스트 조회", description = "레이블 카테고리 리스트를 조회합니다..")
    @SwaggerApiSuccess(description = "카테고리 리스트를 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @GetMapping
    public List<LabelCategoryResponse> getCategoryList(@PathVariable("project_id") final Integer projectId) {
        return categoryService.getCategoryList(projectId);
    }

    @Operation(summary = "카테고리 삭제", description = "카테고리를 삭제합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @SwaggerApiSuccess(description = "카테고리를 성공적으로 삭제합니다.")
    @DeleteMapping("/{category_id}")
    public void deleteCategoryById(@PathVariable("project_id") final Integer projectId, @PathVariable("category_id") final Integer categoryId) {
        categoryService.deleteCategory(projectId, categoryId);
    }
}
