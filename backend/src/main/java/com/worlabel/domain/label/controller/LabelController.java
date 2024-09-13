package com.worlabel.domain.label.controller;

import com.worlabel.domain.label.service.LabelService;
import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.response.BaseResponse;
import com.worlabel.global.response.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name = "레이블링 관련 API")
@RequestMapping("/api/projects/{project_id}/label")
public class LabelController {

    private final LabelService labelService;

    @Operation(summary = "프로젝트 단위 오토레이블링", description = "해당 프로젝트 이미지를 오토레이블링합니다.")
    @SwaggerApiSuccess(description = "해당 프로젝트가 오토 레이블링 됩니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PostMapping("/auto")
    public void projectAutoLabeling(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId) {
        labelService.autoLabeling(projectId, memberId);
    }

    @Operation(summary = "이미지 단위 레이블링", description = "진행한 레이블링을 저장합니다.")
    @SwaggerApiSuccess(description = "해당 이미지에 대한 레이블링을 저장합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PostMapping("/image/{image_id}")
    public void imageLabeling(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("image_id") final Integer imageId) {
        labelService.save(imageId);
    }
}
