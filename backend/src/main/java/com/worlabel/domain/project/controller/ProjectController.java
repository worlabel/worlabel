package com.worlabel.domain.project.controller;

import com.worlabel.domain.participant.entity.dto.ParticipantRequest;
import com.worlabel.domain.project.dto.AutoModelRequest;
import com.worlabel.domain.project.entity.dto.*;
import com.worlabel.domain.project.service.ProjectService;
import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
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
    public ProjectResponse createProject(
        @CurrentUser final Integer memberId,
        @PathVariable("workspace_id") final Integer workspaceId,
        @Valid @RequestBody final ProjectWithCategoryRequest projectRequest) {
        return projectService.createProject(memberId, workspaceId, projectRequest);
    }

    @Operation(summary = "프로젝트 조회", description = "프로젝트를 조회합니다.")
    @SwaggerApiSuccess(description = "프로젝트를 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED, ErrorCode.SERVER_ERROR})
    @GetMapping("/projects/{project_id}")
    public ProjectResponse getProject(@PathVariable("project_id") final Integer projectId) {
        return projectService.getProjectById(projectId);
    }

    @Operation(summary = "전체 프로젝트 조회", description = "모든 프로젝트를 조회합니다.")
    @SwaggerApiSuccess(description = "전체 프로젝트를 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.SERVER_ERROR})
    @GetMapping("/workspaces/{workspace_id}/projects")
    public List<ProjectWithThumbnailResponse> getProjects(
        @PathVariable("workspace_id") Integer workspaceId,
        @CurrentUser final Integer memberId,
        @Parameter(name = "마지막 프로젝트 id", description = "마지막 프로젝트 id를 넣으면 그 아래 부터 가져옴, 넣지않으면 가장 최신", example = "1") @RequestParam(required = false) Integer lastProjectId,
        @Parameter(name = "가져올 프로젝트 수", description = "가져올 프로젝트 수 default = 10", example = "20") @RequestParam(defaultValue = "10") Integer limitPage) {
        return projectService.getProjectsByWorkspaceId(workspaceId, memberId, lastProjectId, limitPage);
    }

    @Operation(summary = "프로젝트 수정", description = "프로젝트를 수정합니다.")
    @SwaggerApiSuccess(description = "프로젝트를 성공적으로 수정합니다.")
    @SwaggerApiError({ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED, ErrorCode.SERVER_ERROR})
    @PutMapping("/projects/{project_id}")
    public ProjectResponse updateProject(
        @PathVariable("project_id") final Integer projectId,
        @Valid @RequestBody final ProjectRequest projectRequest) {
        return projectService.updateProject(projectId, projectRequest);
    }

    @Operation(summary = "프로젝트 오토 레이블링", description = "해당 프로젝트 이미지를 오토레이블링합니다.")
    @SwaggerApiSuccess(description = "해당 프로젝트가 오토 레이블링 됩니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PostMapping("/projects/{project_id}/auto")
    public void autoLabeling(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @RequestBody final AutoModelRequest request) {
        projectService.autoLabeling(memberId, projectId, request);
    }

    @Operation(summary = "프로젝트 삭제", description = "프로젝트를 삭제합니다.")
    @SwaggerApiSuccess(description = "프로젝트를 성공적으로 삭제합니다.")
    @SwaggerApiError({ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED, ErrorCode.SERVER_ERROR})
    @DeleteMapping("/projects/{project_id}")
    public void deleteProject(@PathVariable("project_id") final Integer projectId) {
        projectService.deleteProject(projectId);
    }

    @Operation(summary = "프로젝트 멤버 추가", description = "새로운 프로젝트 멤버를 추가합니다.")
    @SwaggerApiSuccess(description = "프로젝트 멤버를 성공적으로 추가합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PostMapping("/projects/{project_id}/members")
    public void addProjectMember(
        @CurrentUser final Integer memberId,
        @PathVariable("project_id") final Integer projectId,
        @Valid @RequestBody final ParticipantRequest participantRequest) {
        projectService.addProjectMember(memberId, projectId, participantRequest);
    }

    @Operation(summary = "프로젝트 멤버 권한 수정", description = "프로젝트 멤버 권한을 수정합니다.")
    @SwaggerApiSuccess(description = "프로젝트 멤버 권한을 성공적으로 수정합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @PutMapping("/projects/{project_id}/members")
    public void changeProjectMember(
        @PathVariable("project_id") final Integer projectId,
        @Valid @RequestBody final ParticipantRequest participantRequest) {
        projectService.changeProjectMember(projectId, participantRequest);
    }

    @Operation(summary = "프로젝트 멤버 제거", description = "프로젝트 멤버를 제거합니다.")
    @SwaggerApiSuccess(description = "프로젝트 멤버를 성공적으로 제거합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @DeleteMapping("/projects/{project_id}/members")
    public void removeProjectMember(
        @PathVariable("project_id") final Integer projectId,
        @Valid @RequestBody final Integer removeMemberId) {
        projectService.removeProjectMember(projectId, removeMemberId);
    }

    @Operation(summary = "프로젝트 멤버 조회", description = "프로젝트 멤버를 조회합니다.")
    @SwaggerApiSuccess(description = "프로젝트 멤버를 성공적으로 조회합니다.")
    @SwaggerApiError({ErrorCode.EMPTY_REQUEST_PARAMETER, ErrorCode.SERVER_ERROR})
    @GetMapping("/projects/{project_id}/members")
    public List<ProjectMemberResponse> getProjectMember(
        @PathVariable("project_id") final Integer projectId) {
        return projectService.getProjectMember(projectId);
    }
}
