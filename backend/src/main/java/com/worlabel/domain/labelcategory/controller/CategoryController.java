package com.worlabel.domain.labelcategory.controller;

import com.worlabel.domain.labelcategory.entity.dto.CategoryResponse;
import com.worlabel.domain.labelcategory.service.ProjectLabelCategoryService;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "레이블 카테고리 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects/{project_id}/categories")
public class CategoryController {

    private final ProjectLabelCategoryService categoryService;

    @Operation(summary = "프로젝트 레이블 카테고리 리스트 조회", description = "레이블 카테고리 리스트를 조회합니다..")
    @SwaggerApiSuccess(description = "카테고리 리스트를 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @GetMapping
    public List<CategoryResponse> getCategoryList(@PathVariable("project_id") final Integer projectId) {
        return categoryService.getCategoryById(projectId);
    }
}
