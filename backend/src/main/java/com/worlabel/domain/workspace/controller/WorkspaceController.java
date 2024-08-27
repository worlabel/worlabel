package com.worlabel.domain.workspace.controller;

import com.worlabel.domain.workspace.entity.Workspace;
import com.worlabel.domain.workspace.entity.dto.WorkspaceRequest;
import com.worlabel.domain.workspace.service.WorkspaceService;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Workspace> createWorkspace(final Integer memberId, @RequestBody final WorkspaceRequest workspaceRequest) {
        Workspace createdWorkspace = workspaceService.createWorkspace(memberId, workspaceRequest);
        return ResponseEntity.ok(createdWorkspace);
    }

    @Operation(summary = "특정 워크스페이스 조회", description = "특정 워크스페이스를 조회합니다.")
    @SwaggerApiSuccess(description = "특정 워크스페이스를 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    @GetMapping("/{workspace_id}")
    public ResponseEntity<Workspace> getWorkspace(@PathVariable("workspace_id") Integer workspaceId) {
        Workspace workspace = workspaceService.getWorkspaceById(workspaceId);
        return ResponseEntity.ok(workspace);
    }

    @Operation(summary = "전체 워크스페이스 조회", description = "모든 워크스페이스를 조회합니다.")
    @SwaggerApiSuccess(description = "전체 워크스페이스를 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.SERVER_ERROR})
    @GetMapping
    public ResponseEntity<List<Workspace>> getAllWorkspaces() {
        List<Workspace> workspaces = workspaceService.getAllWorkspaces();
        return ResponseEntity.ok(workspaces);
    }

    @Operation(summary = "워크스페이스 수정", description = "특정 워크스페이스를 수정합니다.")
    @SwaggerApiSuccess(description = "특정 워크스페이스를 성공적으로 수정합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    @PutMapping("/{workspace_id}")
    public ResponseEntity<Workspace> updateWorkspace(
            @PathVariable("workspace_id") Integer workspaceId,
            @RequestBody Workspace updatedWorkspace) {
        Workspace workspace = workspaceService.updateWorkspace(workspaceId, updatedWorkspace);
        return ResponseEntity.ok(workspace);
    }

    @Operation(summary = "워크스페이스 삭제", description = "특정 워크스페이스를 삭제합니다.")
    @SwaggerApiSuccess(description = "특정 워크스페이스를 성공적으로 삭제합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    @DeleteMapping("/{workspace_id}")
    public ResponseEntity<Void> deleteWorkspace(@PathVariable("workspace_id") Integer workspaceId) {
        workspaceService.deleteWorkspace(workspaceId);
        return ResponseEntity.noContent().build();
    }
}
