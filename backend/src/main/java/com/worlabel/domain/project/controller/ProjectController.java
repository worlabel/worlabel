package com.worlabel.domain.project.controller;

import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.entity.dto.ProjectRequest;
import com.worlabel.domain.project.entity.dto.ProjectResponse;
import com.worlabel.domain.project.entity.dto.ProjectResponses;
import com.worlabel.domain.project.service.ProjectService;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "프로젝트 관련 API")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @Operation(summary = "프로젝트 생성", description = "새로운 프로젝트를 생성합니다.")
    @SwaggerApiSuccess(description = "프로젝트를 성공적으로 생성합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PostMapping("/workspaces/{workspace_id}/projects")
    public BaseResponse<ProjectResponse> createProject(
            @CurrentUser final Integer memberId,
            @PathVariable("workspace_id") final Integer workspaceId,
            @Valid @RequestBody final ProjectRequest projectRequest) {
        ProjectResponse project = projectService.createProject(memberId, workspaceId, projectRequest);
        return SuccessResponse.of(project);
    }

    @Operation(summary = "프로젝트 조회", description = "프로젝트를 조회합니다.")
    @SwaggerApiSuccess(description = "프로젝트를 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PARTICIPANT_UNAUTHORIZED, ErrorCode.SERVER_ERROR})
    @GetMapping("/projects/{project_id}")
    public BaseResponse<ProjectResponse> getProject(@CurrentUser final Integer memberId, @PathVariable("project_id") final Integer projectId) {
        ProjectResponse project = projectService.getProjectById(memberId, projectId);
        return SuccessResponse.of(project);
    }

    @Operation(summary = "전체 프로젝트 조회", description = "모든 프로젝트를 조회합니다.")
    @SwaggerApiSuccess(description = "전체 프로젝트를 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.SERVER_ERROR})
    @GetMapping("/workspaces/{workspace_id}/projects")
    public BaseResponse<ProjectResponses> getProjects(
            @PathVariable("workspace_id") Integer workspaceId,
            @CurrentUser final Integer memberId,
            @Parameter(name = "마지막 프로젝트 id", description = "마지막 프로젝트 id를 넣으면 그 아래 부터 가져옴, 넣지않으면 가장 최신", example = "1") @RequestParam(required = false) Integer lastProjectId,
            @Parameter(name = "가져올 프로젝트 수", description = "가져올 프로젝트 수 default = 10", example = "20") @RequestParam(defaultValue = "10") Integer limitPage) {
        List<ProjectResponse> projects = projectService.getProjectsByWorkspaceId(workspaceId, memberId, lastProjectId, limitPage);
        return SuccessResponse.of(ProjectResponses.from(projects));
    }

    @Operation(summary = "프로젝트 수정", description = "프로젝트를 수정합니다.")
    @SwaggerApiSuccess(description = "프로젝트를 성공적으로 수정합니다.")
    @SwaggerApiError({ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PARTICIPANT_UNAUTHORIZED, ErrorCode.SERVER_ERROR})
    @PutMapping("/projects/{project_id}")
    public BaseResponse<ProjectResponse> updateProject(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @Valid @RequestBody final ProjectRequest projectRequest) {
        ProjectResponse project = projectService.updateProject(memberId, projectId, projectRequest);
        return SuccessResponse.of(project);
    }

    @Operation(summary = "프로젝트 삭제", description = "프로젝트를 삭제합니다.")
    @SwaggerApiSuccess(description = "프로젝트를 성공적으로 삭제합니다.")
    @SwaggerApiError({ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PARTICIPANT_UNAUTHORIZED, ErrorCode.SERVER_ERROR})
    @DeleteMapping("/projects/{project_id}")
    public BaseResponse<Void> deleteProject(@CurrentUser final Integer memberId,
                                            @PathVariable("project_id") final Integer projectId) {
        projectService.deleteProject(memberId, projectId);
        return SuccessResponse.empty();
    }
}
