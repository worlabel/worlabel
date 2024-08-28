package com.worlabel.domain.workspace.entity.dto;

import com.worlabel.domain.workspace.entity.Workspace;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Schema(name = "워크스페이스 응답 dto", description = "워크스페이스 응답 DTO")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class WorkspaceResponse {

    @Schema(description = "워크스페이스 ID", example = "1")
    private Integer id;

    @Schema(description = "회원 ID", example = "member123")
    private String memberId;

    @Schema(description = "제목", example = "workspace1")
    private String title;

    @Schema(description = "내용", example = "갤럭시 s24 불량 검증")
    private String content;

    @Schema(description = "생성일시", example = "2024-07-25 17:51:02")
    private LocalDateTime createdAt;

    @Schema(description = "수정일시", example = "2024-07-28 17:51:02")
    private LocalDateTime updatedAt;

    public static WorkspaceResponse from(final Workspace workspace) {
        return new WorkspaceResponse(
                workspace.getId(),
                workspace.getMember().getNickname(),
                workspace.getTitle(),
                workspace.getDescription(),
                workspace.getCreatedAt(),
                workspace.getUpdatedAt());
    }
}