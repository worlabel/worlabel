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
    @SwaggerApiSuccess(description = "압축폴더를 성공적으로 업로드합니다.")
    @Operation(summary = "압축 폴더 업로드", description = "압축 폴더 내 폴더와 이미지 파일을 업로드합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    public void uploadFolder(
            @CurrentUser final Integer memberId,
            @Parameter(name = "압축 폴더", description = "압축 폴더를 추가해준다.", example = "") @RequestPart final MultipartFile folderZip,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("folder_id") final Integer folderId) throws IOException {
        imageService.uploadFolderWithImages(folderZip, projectId, folderId, memberId);
    }

    @PostMapping("/folders/{folder_id}/images/presigned")
    @SwaggerApiSuccess(description = "이미지에 대한 presigned 주소를 받아옵니다..")
    @Operation(summary = "이미지에 대한 Presigned ", description = "이미지에 대한 Presigned 주소를 받아옵니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    public List<ImagePresignedUrlResponse> uploadFolderByPresignedImage(
            @RequestBody final List<ImageMetaRequest> imageMetaList,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("folder_id") final Integer folderId) {
        return imageService.uploadFolderByPresignedImage(imageMetaList, projectId, folderId);
    }

    @GetMapping("/folders/{folder_id}/images/{image_id}")
    @SwaggerApiSuccess(description = "이미지를 단일 조회합니다.")
    @Operation(summary = "이미지 단일 조회", description = "이미지 정보를 단일 조회합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    public ImageResponse getImageById(
            @PathVariable("folder_id") final Integer folderId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("image_id") final Long imageId) {
        log.debug("project: {} , folder: {}, image: {}", projectId, folderId, imageId);
        return imageService.getImageById(projectId, folderId, imageId);
    }

    @PutMapping("/folders/{folder_id}/images/{image_id}")
    @SwaggerApiSuccess(description = "이미지 폴더 이동.")
    @Operation(summary = "이미지 폴더 이동", description = "이미지가 위치한 폴더를 변경합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR, ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED})
    public void moveFolderImage(
            @PathVariable("folder_id") final Integer folderId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("image_id") final Long imageId,
            @RequestBody final ImageMoveRequest imageMoveRequest) {
        log.debug("project: {} , folder: {}, image: {}, 이동하는 폴더 {}", projectId, folderId, imageId, imageMoveRequest.getMoveFolderId());
        imageService.moveFolder(projectId, folderId, imageMoveRequest.getMoveFolderId(), imageId);
    }

    @DeleteMapping("/folders/{folder_id}/images/{image_id}")
    @SwaggerApiSuccess(description = "이미지 삭제.")
    @Operation(summary = "이미지 삭제", description = "폴더에서 해당 이미지를 제거합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR, ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED})
    public void deleteImage(
            @PathVariable("folder_id") final Integer folderId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("image_id") final Long imageId) {
        imageService.deleteImage(projectId, folderId, imageId);
    }

    @PutMapping("/folders/{folder_id}/images/{image_id}/status")
    @SwaggerApiSuccess(description = "이미지 상태 변경.")
    @Operation(summary = "이미지 상태 변경", description = "특정 이미지의 상태를 변경합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR, ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED})
    public ImageResponse changeImageStatus(
            @PathVariable("folder_id") final Integer folderId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("image_id") final Long imageId,
            @RequestBody final ImageStatusRequest imageStatusRequest) {
        return imageService.changeImageStatus(projectId, folderId, imageId, imageStatusRequest);
    }

    @Operation(summary = "이미지 단위 레이블링", description = "진행한 레이블링을 저장합니다.")
    @SwaggerApiSuccess(description = "해당 이미지에 대한 레이블링을 저장합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PostMapping("/images/{image_id}/label")
    public void imageLabeling(
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("image_id") final Long imageId,
            @RequestBody final ImageLabelRequest labelRequest
    ) {
        imageService.saveUserLabel(projectId, imageId, labelRequest);
    }
}
