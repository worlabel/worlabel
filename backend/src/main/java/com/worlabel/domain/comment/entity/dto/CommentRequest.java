package com.worlabel.domain.comment.entity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Schema(name = "댓글 요청 dto", description = "댓글 요청 DTO")
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
public class CommentRequest {

    @Schema(description = "댓글 내용", example = "여기 부분 더 상세하게 나타내야해요")
    @NotEmpty(message = "내용을 입력하세요.")
    private String content;

    @Schema(description = "X 좌표", example = "3.1462")
    @NotNull(message = "x좌표를 입력해주세요.")
    private double positionX;

    @Schema(description = "Y 좌표", example = "7.1462")
    @NotNull(message = "y좌표를 입력해주세요.")
    private double positionY;
}
