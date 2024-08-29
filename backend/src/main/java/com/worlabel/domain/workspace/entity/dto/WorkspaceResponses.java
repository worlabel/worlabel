package com.worlabel.domain.workspace.entity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Schema(name = "워크스페이스 목록 응답 dto", description = "워크스페이스 목록 응답 DTO")
public class WorkspaceResponses {

    @Schema(description = "워크스페이스 목록", example = "")
    private List<WorkspaceResponse> workspaceResponses;

    public static WorkspaceResponses from(final List<WorkspaceResponse> workspaceResponses) {
        return new WorkspaceResponses(workspaceResponses);
    }
}
