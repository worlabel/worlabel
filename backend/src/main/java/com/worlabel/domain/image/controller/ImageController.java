package com.worlabel.domain.image.controller;

import com.worlabel.domain.folder.entity.dto.FolderResponse;
import com.worlabel.domain.image.entity.dto.*;
import com.worlabel.domain.image.service.ImageService;
import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects/{project_id}")
@Tag(name = "이미지 관련 API")
public class ImageController {

    private final ImageService imageService;

    @PostMapping("/folders/{folder_id}/images/file")
    @SwaggerApiSuccess(description = "이미지 목록을 성공적으로 업로드합니다.")
    @Operation(summary = "이미지 목록 업로드", description = "이미지 목록을 업로드합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    public void uploadImage(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("folder_id") final Integer folderId,
            @Parameter(name = "폴더에 추가 할 이미지 리스트", description = "MultiPartFile을 imageList로 추가해준다.", example = "") @RequestPart final List<MultipartFile> imageList) {
        imageService.uploadImageList(imageList, folderId, projectId, memberId);
    }

    @PostMapping("/folders/{folder_id}/images/zip")
    @SwaggerApiSuccess(description = "폴더와 이미지 파일을 성공적으로 업로드합니다.")
    @Operation(summary = "폴더 업로드", description = "폴더와 이미지 파일을 업로드합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    public void uploadFolder(
            @Parameter(name = "폴더", description = "MultiPartFile을 폴더나 zip으로 추가해준다.", example = "") @RequestPart final MultipartFile folderZip,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("folder_id") final Integer folderId) throws IOException {
        imageService.uploadFolderWithImages(folderZip, projectId, folderId);
    }

    @GetMapping("/folders/{folder_id}/images/{image_id}")
    @SwaggerApiSuccess(description = "이미지를 단일 조회합니다.")
    @Operation(summary = "이미지 단일 조회", description = "이미지 정보를 단일 조회합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    public ImageResponse getImageById(
            @CurrentUser final Integer memberId,
            @PathVariable("folder_id") final Integer folderId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("image_id") final Long imageId) {
        log.debug("project: {} , folder: {}, image: {}, 현재 로그인 중인 사용자 : {}", projectId, folderId, memberId, imageId);
        return imageService.getImageById(projectId, folderId, imageId, memberId);
    }

    @PutMapping("/folders/{folder_id}/images/{image_id}")
    @SwaggerApiSuccess(description = "이미지 폴더 이동.")
    @Operation(summary = "이미지 폴더 이동", description = "이미지가 위치한 폴더를 변경합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR, ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED})
    public void moveFolderImage(
            @CurrentUser final Integer memberId,
            @PathVariable("folder_id") final Integer folderId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("image_id") final Long imageId,
            @RequestBody final ImageMoveRequest imageMoveRequest) {
        log.debug("project: {} , folder: {}, image: {}, 현재 로그인 중인 사용자 : {}, 이동하는 폴더 {}", projectId, folderId, memberId, imageId, imageMoveRequest.getMoveFolderId());
        imageService.moveFolder(projectId, folderId, imageMoveRequest.getMoveFolderId(), imageId, memberId);
    }

    @DeleteMapping("/folders/{folder_id}/images/{image_id}")
    @SwaggerApiSuccess(description = "이미지 삭제.")
    @Operation(summary = "이미지 삭제", description = "폴더에서 해당 이미지를 제거합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR, ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED})
    public void deleteImage(
            @CurrentUser final Integer memberId,
            @PathVariable("folder_id") final Integer folderId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("image_id") final Long imageId) {
        log.debug("project: {} , folder: {}, 삭제하려는 이미지: {}, 현재 로그인 중인 사용자 : {}", projectId, folderId, imageId, memberId);
        imageService.deleteImage(projectId, folderId, imageId, memberId);
    }

    @PutMapping("/folders/{folder_id}/images/{image_id}/status")
    @SwaggerApiSuccess(description = "이미지 상태 변경.")
    @Operation(summary = "이미지 상태 변경", description = "특정 이미지의 상태를 변경합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR, ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED})
    public ImageResponse changeImageStatus(
            @CurrentUser final Integer memberId,
            @PathVariable("folder_id") final Integer folderId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("image_id") final Long imageId,
            @RequestBody final ImageStatusRequest imageStatusRequest) {
        log.debug("project: {} , folder: {}, 수정하려는 이미지: {}, 현재 로그인 중인 사용자 : {}", projectId, folderId, imageId, memberId);
        return imageService.changeImageStatus(projectId, folderId, imageId, memberId, imageStatusRequest);
    }

    @Operation(summary = "이미지 단위 레이블링", description = "진행한 레이블링을 저장합니다.")
    @SwaggerApiSuccess(description = "해당 이미지에 대한 레이블링을 저장합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PostMapping("/images/{image_id}/label")
    public void imageLabeling(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("image_id") final Long imageId,
            @RequestBody final ImageLabelRequest labelRequest
    ) {
        imageService.saveUserLabel(memberId, projectId, imageId, labelRequest);
    }
}
