package com.worlabel.domain.project.entity.dto;

import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.entity.ProjectType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Schema(name = "프로젝트 응답 dto", description = "프로젝트 응답 DTO")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ProjectResponse {

    @Schema(description = "워크스페이스 ID", example = "1")
    private Integer id;

    @Schema(description = "제목", example = "project")
    private String title;

    @Schema(description = "워크스페이스 id", example = "1")
    private Integer projectId;

    @Schema(description = "프로젝트 타입", example = "classification")
    private ProjectType projectType;

    @Schema(description = "생성일시", example = "2024-07-25 17:51:02")
    private LocalDateTime createdAt;

    @Schema(description = "수정일시", example = "2024-07-28 17:51:02")
    private LocalDateTime updatedAt;

    public static ProjectResponse from(final Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getWorkspace().getId(),
                project.getProjectType(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
}