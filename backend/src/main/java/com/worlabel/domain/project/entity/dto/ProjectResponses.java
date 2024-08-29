package com.worlabel.domain.project.entity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Schema(name = "프로젝트 목록 응답 dto", description = "프로젝트 목록 응답 DTO")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ProjectResponses {

    @Schema(description = "프로젝트 목록", example = "")
    private List<ProjectResponse> workspaceResponses;

    public static ProjectResponses from(final List<ProjectResponse> projectResponses) {
        return new ProjectResponses(projectResponses);
    }
}
