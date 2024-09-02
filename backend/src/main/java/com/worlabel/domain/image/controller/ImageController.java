package com.worlabel.domain.image.controller;

import com.worlabel.domain.folder.entity.dto.FolderRequest;
import com.worlabel.domain.folder.entity.dto.FolderResponse;
import com.worlabel.domain.folder.service.FolderService;
import com.worlabel.domain.image.service.ImageService;
import com.worlabel.domain.project.service.ProjectService;
import com.worlabel.domain.workspace.entity.dto.WorkspaceResponse;
import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.response.BaseResponse;
import com.worlabel.global.response.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects/{project_id}/folders/{folder_id}/images")
@Tag(name = "이미지 관련 API")
public class ImageController {

    private final ImageService imageService;

    @PostMapping("")
    @SwaggerApiSuccess(description = "이미지 목록을 성공적으로 업로드합니다.")
    @Operation(summary = "이미지 목록 업로드", description = "이미지 목록을 업로드합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    public BaseResponse<Void> uploadImage(
            @CurrentUser final Integer memberId,
            @PathVariable("folder_id") final Integer folderId,
            @PathVariable("project_id") final Integer projectId,
            @Parameter(name = "폴더에 추가 할 이미지 리스트", description = "MultiPartFile을 imageList로 추가해준다.", example = "") @RequestBody final List<MultipartFile> imageList
    ) {
        log.debug("project: {} , folder: {}, imageList upload, 현재 로그인 중인 사용자 : {}, 이미지 개수 : {}", projectId, folderId, memberId, imageList.size());
        imageService.uploadImageList(imageList, folderId, projectId, memberId);
        return SuccessResponse.empty();
    }

    
}


