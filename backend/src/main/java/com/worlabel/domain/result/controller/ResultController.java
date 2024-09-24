package com.worlabel.domain.result.controller;

import com.worlabel.domain.result.entity.dto.ResultResponse;
import com.worlabel.domain.result.service.ResultService;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "결과 관련 API")
@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @Operation(summary = "모델 결과 조회", description = "모델 결과를 조회합니다.")
    @SwaggerApiSuccess(description = "모델 결과를 성공적으로 조회합니다")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @GetMapping("/model/{model_id}")
    public List<ResultResponse> getResultsByModelId(@PathVariable("model_id") final Integer modelId) {
        return resultService.getResultsByModelId(modelId);
    }
}