package com.worlabel.domain.folder.controller;

import com.worlabel.domain.folder.entity.dto.FolderRequest;
import com.worlabel.domain.folder.entity.dto.FolderResponse;
import com.worlabel.domain.folder.service.FolderService;
import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.ErrorCode;
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
    public FolderResponse createFolder(
            @PathVariable("project_id") final Integer projectId,
            @RequestBody final FolderRequest folderRequest) {
        return folderService.createFolder(projectId, folderRequest);
    }

    @Operation(summary = "폴더 조회", description = "폴더의 내용을 조회합니다.")
    @SwaggerApiSuccess(description = "폴더를 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @GetMapping("/{folder_id}")
    public FolderResponse getFolderById(
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("folder_id") final Integer folderId) {
        return folderService.getFolderById(projectId, folderId);
    }

    @Operation(summary = "폴더 하위 리뷰해야할 목록만 조회", description = "폴더하위 리뷰해야할 목록을 조회합니다.")
    @SwaggerApiSuccess(description = "폴더 하위 리뷰해야할 목록을 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @GetMapping("/{folder_id}/review")
    public FolderResponse getFolderByIdWithNeedReview(
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("folder_id") final Integer folderId) {
        return folderService.getFolderByIdWithNeedReview(projectId, folderId);
    }

    @Operation(summary = "폴더 수정", description = "폴더 정보를 수정합니다.")
    @SwaggerApiSuccess(description = "폴더를 성공적으로 수정합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PutMapping("/{folder_id}")
    public FolderResponse updateFolder(
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("folder_id") final Integer folderId,
            @RequestBody FolderRequest folderRequest) {
        return folderService.updateFolder(projectId, folderId, folderRequest);
    }

    @Operation(summary = "폴더 삭제", description = "폴더를 삭제합니다.")
    @SwaggerApiSuccess(description = "폴더를 성공적으로 삭제합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @DeleteMapping("/{folder_id}")
    public void deleteFolder(
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("folder_id") final Integer folderId) {
        folderService.deleteFolder(projectId, folderId);
    }
}
