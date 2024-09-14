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
    public WorkspaceResponse createWorkspace(@CurrentUser final Integer memberId, @Valid @RequestBody final WorkspaceRequest workspaceRequest) {
        return workspaceService.createWorkspace(memberId, workspaceRequest);
    }

    @Operation(summary = "특정 워크스페이스 조회", description = "특정 워크스페이스를 조회합니다.")
    @SwaggerApiSuccess(description = "특정 워크스페이스를 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    @GetMapping("/{workspace_id}")
    public WorkspaceResponse getWorkspace(@CurrentUser final Integer memberId, @PathVariable("workspace_id") final Integer workspaceId) {
        return workspaceService.getWorkspaceById(memberId, workspaceId);
    }

    @Operation(summary = "전체 워크스페이스 조회", description = "모든 워크스페이스를 조회합니다.")
    @SwaggerApiSuccess(description = "전체 워크스페이스를 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.SERVER_ERROR})
    @GetMapping
    public WorkspaceResponses getAllWorkspaces(
            @CurrentUser final Integer memberId,
            @Parameter(name = "마지막 워크스페이스 id", description = "마지막 워크스페이스 id를 넣으면 그 아래 부터 가져옴, 넣지않으면 가장 최신", example = "1") @RequestParam(required = false) Integer lastWorkspaceId,
            @Parameter(name = "가져올 워크스페이스 수", description = "가져올 워크스페이스 수 default = 10", example = "20") @RequestParam(defaultValue = "10") Integer limitPage) {
        List<WorkspaceResponse> workspaces = workspaceService.getAllWorkspaces(memberId, lastWorkspaceId, limitPage);
        return WorkspaceResponses.from(workspaces);
    }

    @Operation(summary = "워크스페이스 수정", description = "특정 워크스페이스를 수정합니다.")
    @SwaggerApiSuccess(description = "특정 워크스페이스를 성공적으로 수정합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    @PutMapping("/{workspace_id}")
    public WorkspaceResponse updateWorkspace(
            @CurrentUser final Integer memberId,
            @PathVariable("workspace_id") final Integer workspaceId,
            @Valid @RequestBody final WorkspaceRequest updatedWorkspace ) {
        return workspaceService.updateWorkspace(memberId, workspaceId, updatedWorkspace);
    }

    @Operation(summary = "워크스페이스 삭제", description = "특정 워크스페이스를 삭제합니다.")
    @SwaggerApiSuccess(description = "특정 워크스페이스를 성공적으로 삭제합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    @DeleteMapping("/{workspace_id}")
    public void deleteWorkspace(@CurrentUser final Integer memberId, @PathVariable("workspace_id") final Integer workspaceId) {
        workspaceService.deleteWorkspace(memberId, workspaceId);
    }

    @Operation(summary = "워크스페이스 멤버 추가", description = "특정 워크스페이스에 멤버를 추가합니다.")
    @SwaggerApiSuccess(description = "특정 워크스페이스에 멤버를 성공적으로 추가합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    @PostMapping("/{workspace_id}/members/{member_id}")
    public void addWorkspaceMember(
            @CurrentUser final Integer memberId,
            @PathVariable("workspace_id") final Integer workspaceId,
            @PathVariable("member_id") final Integer newMemberId) {
        workspaceService.addWorkspaceMember(memberId, workspaceId, newMemberId);
    }

    @Operation(summary = "워크스페이스 멤버 제거", description = "특정 워크스페이스에 멤버를 제거합니다.")
    @SwaggerApiSuccess(description = "특정 워크스페이스에 멤버를 성공적으로 제거합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    @DeleteMapping("/{workspace_id}/members/{member_id}")
    public void removeWorkspaceMember(
            @CurrentUser final Integer memberId,
            @PathVariable("workspace_id") final Integer workspaceId,
            @PathVariable("member_id") final Integer newMemberId) {
        workspaceService.removeWorkspaceMember(memberId, workspaceId, newMemberId);
    }
}