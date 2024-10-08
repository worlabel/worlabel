package com.worlabel.domain.workspace.entity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Schema(name = "워크스페이스 요청 dto", description = "워크스페이스 작성시 필요한 정보")
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
public class WorkspaceRequest {

    @Schema(description = "제목", example = "title1")
    @NotEmpty(message = "제목을 입력하세요.")
    private String title;

    @Schema(description = "내용", example = "content1")
    @NotEmpty(message = "내용을 입력하세요.")
    private String content;
}