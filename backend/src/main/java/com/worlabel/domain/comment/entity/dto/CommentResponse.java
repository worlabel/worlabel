package com.worlabel.domain.comment.entity.dto;

import com.worlabel.domain.comment.entity.Comment;
import com.worlabel.domain.member.entity.dto.MemberResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Schema(name = "댓글 응답 DTO", description = "댓글 조회 응답 DTO")
@Getter
@AllArgsConstructor
public class CommentResponse {

    @Schema(description = "댓글 ID", example = "1")
    private Integer id;

    @Schema(description = "작성자", example = "")
    private MemberResponse author;

    @Schema(description = "y좌표", example = "3.16324")
    private double positionY;

    @Schema(description = "x좌표", example = "7.16324")
    private double positionX;

    @Schema(description = "댓글 내용", example = "이 부분 더 자세하게 표현해주세요")
    private String content;

    @Schema(description = "작성 일자", example = "2024-09-09T14:47:45")
    private LocalDateTime createTime;

    public static CommentResponse from(final Comment comment) {
        return new CommentResponse(comment.getId(),
                MemberResponse.of(comment.getMember()),
                comment.getPositionY(),
                comment.getPositionX(),
                comment.getContent(),
                comment.getCreatedAt());
    }
}
