package com.worlabel.domain.report.controller;

import com.worlabel.domain.report.entity.dto.ReportRequest;
import com.worlabel.domain.report.entity.dto.ReportResponse;
import com.worlabel.domain.report.service.ReportService;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "리포트 관련 API")
@RestController
@RequestMapping("/api/projects/{project_id}/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @Operation(summary = "완성된 모델 리포트를 조회합니다.", description = "완성된 모델 리포트를 조회합니다.")
    @SwaggerApiSuccess(description = "완성된 모델 리포트를 조회합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @GetMapping("/models/{model_id}")
    public List<ReportResponse> getReportsByModelId(@PathVariable("model_id") final Integer modelId, @PathVariable("project_id") final Integer projectId) {
        return reportService.getReportsByModelId(projectId,modelId);
    }

    @Operation(summary = "학습중인 모델 리포트를 조회합니다.", description = "학습중인 모델 리포트를 조회합니다.")
    @SwaggerApiSuccess(description = "학습중인 모델 리포트를 조회합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @GetMapping("/models/{model_id}/progress")
    public List<ReportResponse> getReportsProgressByModelId(@PathVariable("project_id") final Integer projectId, @PathVariable("model_id") final Integer modelId) {
        return reportService.getReportsProgressByModelId(projectId,modelId);
    }

    @Operation(summary = "모델 리포트 추가(ai전용)", description = "모델 리포트를 추가합니다,(ai전용)")
    @SwaggerApiSuccess(description = "모델 리포트를 추가합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PostMapping("/models/{model_id}")
    public void addReportByModelId(@PathVariable("project_id") final Integer projectId, @PathVariable("model_id") final Integer modelId, @RequestBody final ReportRequest reportRequest) {
        reportService.addReportByModelId(projectId, modelId, reportRequest);
    }
}