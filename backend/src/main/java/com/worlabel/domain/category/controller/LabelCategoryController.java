package com.worlabel.domain.category.controller;

import com.worlabel.domain.category.entity.dto.CategoryRequest;
import com.worlabel.domain.category.entity.dto.CategoryResponse;
import com.worlabel.domain.category.service.CategoryService;
import com.worlabel.domain.folder.entity.dto.FolderRequest;
import com.worlabel.domain.folder.entity.dto.FolderResponse;
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

@Tag(name = "레이블 카테고리 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects/{project_id}/categories")
public class LabelCategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "레이블 카테고리 생성", description = "프로젝트에 카테고리를 생성합니다.")
    @SwaggerApiSuccess(description = "카테고리 성공적으로 생성합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PostMapping
    public BaseResponse<CategoryResponse> createFolder(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @RequestBody final CategoryRequest categoryRequest) {
//        return SuccessResponse.of(folderResponse);
        CategoryResponse response = categoryService.createCategory(memberId, projectId, categoryRequest);
        return SuccessResponse.empty();
    }
}
