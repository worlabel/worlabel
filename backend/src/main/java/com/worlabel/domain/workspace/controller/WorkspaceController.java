package com.worlabel.domain.workspace.controller;

import com.worlabel.domain.workspace.entity.dto.WorkspaceRequest;
import com.worlabel.domain.workspace.entity.dto.WorkspaceResponse;
import com.worlabel.domain.workspace.entity.dto.WorkspaceResponses;
import com.worlabel.domain.workspace.service.WorkspaceService;
import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.response.BaseResponse;
import com.worlabel.global.response.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "워크스페이스 관련 API")
@RestController
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @Operation(summary = "워크스페이스 생성", description = "새로운 워크스페이스를 생성합니다.")
    @SwaggerApiSuccess(description = "워크스페이스를 성공적으로 생성합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PostMapping
    public BaseResponse<WorkspaceResponse> createWorkspace(@CurrentUser final Integer memberId, @Valid @RequestBody final WorkspaceRequest workspaceRequest) {
        WorkspaceResponse workspace = workspaceService.createWorkspace(memberId, workspaceRequest);
        return SuccessResponse.of(workspace);
    }

    @Operation(summary = "특정 워크스페이스 조회", description = "특정 워크스페이스를 조회합니다.")
    @SwaggerApiSuccess(description = "특정 워크스페이스를 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    @GetMapping("/{workspace_id}")
    public BaseResponse<WorkspaceResponse> getWorkspace(@CurrentUser final Integer memberId, @PathVariable("workspace_id") final Integer workspaceId) {
        WorkspaceResponse workspace = workspaceService.getWorkspaceById(memberId, workspaceId);
        return SuccessResponse.of(workspace);
    }

    @Operation(summary = "전체 워크스페이스 조회", description = "모든 워크스페이스를 조회합니다.")
    @SwaggerApiSuccess(description = "전체 워크스페이스를 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.SERVER_ERROR})
    @GetMapping
    public BaseResponse<WorkspaceResponses> getAllWorkspaces(
            @CurrentUser final Integer memberId,
            @Parameter(name = "마지막 워크스페이스 id", description = "마지막 워크스페이스 id를 넣으면 그 아래 부터 가져옴, 넣지않으면 가장 최신", example = "1") @RequestParam(required = false) Integer lastWorkspaceId,
            @Parameter(name = "가져올 워크스페이스 수", description = "가져올 워크스페이스 수 default = 10", example = "20") @RequestParam(defaultValue = "10") Integer limitPage) {
        List<WorkspaceResponse> workspaces = workspaceService.getAllWorkspaces(memberId, lastWorkspaceId, limitPage);
        return SuccessResponse.of(WorkspaceResponses.from(workspaces));
    }

    @Operation(summary = "워크스페이스 수정", description = "특정 워크스페이스를 수정합니다.")
    @SwaggerApiSuccess(description = "특정 워크스페이스를 성공적으로 수정합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    @PutMapping("/{workspace_id}")
    public BaseResponse<WorkspaceResponse> updateWorkspace(
            @CurrentUser final Integer memberId,
            @PathVariable("workspace_id") final Integer workspaceId,
            @Valid @RequestBody final WorkspaceRequest updatedWorkspace) {
        WorkspaceResponse workspace = workspaceService.updateWorkspace(memberId, workspaceId, updatedWorkspace);
        return SuccessResponse.of(workspace);
    }

    @Operation(summary = "워크스페이스 삭제", description = "특정 워크스페이스를 삭제합니다.")
    @SwaggerApiSuccess(description = "특정 워크스페이스를 성공적으로 삭제합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    @DeleteMapping("/{workspace_id}")
    public BaseResponse<Void> deleteWorkspace(@CurrentUser final Integer memberId, @PathVariable("workspace_id") final Integer workspaceId) {
        workspaceService.deleteWorkspace(memberId, workspaceId);
        return SuccessResponse.empty();
    }
}
