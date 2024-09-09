package com.worlabel.domain.comment.entity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Schema(name = "댓글 목록 응답 dto", description = "댓글 목록 응답 DTO")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CommentResponses {

    @Schema(description = "댓글 목록", example = "")
    private List<CommentResponse> commentResponses;

    public static CommentResponses from(final List<CommentResponse> commentResponses) {
        return new CommentResponses(commentResponses);
    }
}
