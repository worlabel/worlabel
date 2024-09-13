package com.worlabel.domain.category.controller;

import com.worlabel.domain.category.entity.dto.LabelCategoryRequest;
import com.worlabel.domain.category.entity.dto.LabelCategoryResponse;
import com.worlabel.domain.category.service.LabelCategoryService;
import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.response.BaseResponse;
import com.worlabel.global.response.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "레이블 카테고리 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects/{project_id}/categories")
public class LabelCategoryController {

    private final LabelCategoryService categoryService;

    @Operation(summary = "레이블 카테고리 생성", description = "프로젝트에 카테고리를 생성합니다.")
    @SwaggerApiSuccess(description = "카테고리 성공적으로 생성합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PostMapping
    public LabelCategoryResponse createFolder(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @RequestBody final LabelCategoryRequest categoryRequest) {
        return categoryService.createCategory(memberId, projectId, categoryRequest);
    }

    @Operation(summary = "레이블 카테고리 단일 조회", description = "레이블 카테고리를 조회합니다..")
    @SwaggerApiSuccess(description = "카테고리 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @GetMapping("/{category_id}")
    public LabelCategoryResponse getCategoryById(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("category_id") final Integer categoryId
    ) {
        return categoryService.getCategoryById(memberId, projectId, categoryId);
    }

    @Operation(summary = "레이블 카테고리 리스트 조회", description = "레이블 카테고리 리스트를 조회합니다..")
    @SwaggerApiSuccess(description = "카테고리 리스트를 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @GetMapping
    public List<LabelCategoryResponse> getCategoryList(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId
    ) {
        return categoryService.getCategoryList(memberId, projectId);
    }
    

    @Operation(summary = "카테고리 삭제", description = "카테고리를 삭제합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @SwaggerApiSuccess(description = "카테고리를 성공적으로 삭제합니다.")
    @DeleteMapping("/{category_id}")
    public BaseResponse<Void> deleteFolder(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("category_id") final Integer categoryId) {
        categoryService.deleteCategory(memberId, projectId, categoryId);
        return SuccessResponse.empty();
    }
}
