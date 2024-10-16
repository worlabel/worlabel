package com.worlabel.domain.model.controller;

import com.worlabel.domain.model.entity.dto.AiModelRequest;
import com.worlabel.domain.model.entity.dto.AiModelResponse;
import com.worlabel.domain.model.entity.dto.MemoryResponse;
import com.worlabel.domain.model.entity.dto.ModelTrainRequest;
import com.worlabel.domain.model.service.AiModelService;
import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "모델 관련 API")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AiModelController {

    private final AiModelService aiModelService;

    @Operation(summary = "프로젝트 모델 조회", description = "프로젝트에 있는 모델을 조회합니다.")
    @SwaggerApiSuccess(description = "프로젝트 모델을 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @GetMapping("/projects/{project_id}/models")
    public List<AiModelResponse> getModelList(
            @PathVariable("project_id") final Integer projectId) {
        return aiModelService.getModelList(projectId);
    }

    @Operation(summary = "프로젝트 모델 추가", description = "프로젝트에 있는 모델을 추가합니다.")
    @SwaggerApiSuccess(description = "프로젝트 모델을 추가합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PostMapping("/projects/{project_id}/models")
    public void addModel(
            @PathVariable("project_id") final Integer projectId,
            @Valid @RequestBody final AiModelRequest aiModelRequest) {
        aiModelService.addModel(projectId, aiModelRequest);
    }

    @Operation(summary = "프로젝트 모델 이름 변경", description = "프로젝트에 있는 모델의 이름을 변경합니다.")
    @SwaggerApiSuccess(description = "프로젝트 모델의 이름이 변경됩니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PutMapping("/projects/{project_id}/models/{model_id}")
    public void renameModel(
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("model_id") final Integer modelId,
            @Valid @RequestBody final AiModelRequest aiModelRequest) {
        aiModelService.renameModel(projectId, modelId, aiModelRequest);
    }

    @Operation(summary = "프로젝트 모델 학습", description = "프로젝트 모델을 학습시킵니다.")
    @SwaggerApiSuccess(description = "프로젝트 모델이 성공적으로 학습됩니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PostMapping("/projects/{project_id}/train")
    public void trainModel(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @RequestBody final ModelTrainRequest trainRequest) {
        log.debug("모델 학습 요청 {}", trainRequest);
        aiModelService.train(memberId, projectId, trainRequest);
    }

    @Operation(summary = "프로젝트 모델 다운로드", description = "프로젝트 모델을 다운로드합니다.")
    @SwaggerApiSuccess(description = "프로젝트 모델이 성공적으로 다운로드됩니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PostMapping("/projects/{project_id}/models/{model_id}/download")
    public ResponseEntity<Resource> modelDownload(
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("model_id") final Integer modelId) {
        log.debug("다운로드 요청 projectId : {} modelId : {}", projectId, modelId);
        return aiModelService.modelDownload(projectId, modelId);
    }

    @Operation(summary = "GPU 서버 메모리 상태", description = "GPU 서버의 메모리 상태를 반환")
    @SwaggerApiSuccess(description = "프로젝트 모델이 성공적으로 다운로드됩니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @GetMapping("/gpu/memory")
    public MemoryResponse getMemory() {
        return aiModelService.getMemory();
    }
}
