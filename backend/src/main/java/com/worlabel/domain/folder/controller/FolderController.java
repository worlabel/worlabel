package com.worlabel.domain.folder.controller;

import com.worlabel.domain.folder.entity.dto.FolderRequest;
import com.worlabel.domain.folder.entity.dto.FolderResponse;
import com.worlabel.domain.folder.service.FolderService;
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

@Tag(name = "폴더 관련 API")
@RestController
@RequestMapping("/api/projects/{project_id}/folders")
@RequiredArgsConstructor
public class FolderController {

    private final FolderService folderService;


    @Operation(summary = "폴더 생성", description = "프로젝트에 폴더를 생성합니다.")
    @SwaggerApiSuccess(description = "폴더를 성공적으로 생성합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PostMapping
    public BaseResponse<FolderResponse> createFolder(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @RequestBody final FolderRequest folderRequest) {
        FolderResponse folderResponse = folderService.createFolder(memberId, projectId, folderRequest);
        return SuccessResponse.of(folderResponse);
    }

    @Operation(summary = "폴더 조회", description = "폴더의 내용을 조회합니다.")
    @SwaggerApiSuccess(description = "폴더를 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @GetMapping("/{folder_id}")
    public BaseResponse<FolderResponse> getFolderById(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("folder_id") final Integer folderId) {
        FolderResponse folderResponse = folderService.getFolderById(memberId, projectId, folderId);
        return SuccessResponse.of(folderResponse);
    }

    @Operation(summary = "폴더 수정", description = "폴더 정보를 수정합니다.")
    @SwaggerApiSuccess(description = "폴더를 성공적으로 수정합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PutMapping("/{folder_id}")
    public BaseResponse<FolderResponse> updateFolder(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("folder_id") final Integer folderId,
            @RequestBody FolderRequest folderRequest) {
        FolderResponse folderResponse = folderService.updateFolder(memberId, projectId, folderId, folderRequest);
        return SuccessResponse.of(folderResponse);
    }

    @Operation(summary = "폴더 삭제", description = "폴더를 삭제합니다.")
    @SwaggerApiSuccess(description = "폴더를 성공적으로 삭제합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @DeleteMapping("/{folder_id}")
    public BaseResponse<Void> deleteFolder(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("folder_id") final Integer folderId) {
        folderService.deleteFolder(memberId, projectId, folderId);
        return SuccessResponse.empty();
    }
}
