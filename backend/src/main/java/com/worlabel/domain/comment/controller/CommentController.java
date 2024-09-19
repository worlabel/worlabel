package com.worlabel.domain.comment.controller;

import com.worlabel.domain.comment.entity.dto.CommentRequest;
import com.worlabel.domain.comment.entity.dto.CommentResponse;
import com.worlabel.domain.comment.entity.dto.CommentResponses;
import com.worlabel.domain.comment.service.CommentService;
import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{project_id}/comments")
@RequiredArgsConstructor
@Tag(name = "댓글 관련 API")
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/images/{image_id}")
    @SwaggerApiSuccess(description = "댓글 목록을 성공적으로 조회합니다.")
    @Operation(summary = "댓글 목록 조회", description = "댓글 목록을 조회합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    public CommentResponses getAllComments(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("image_id") final Long imageId) {
        List<CommentResponse> comments = commentService.getAllComments(memberId, projectId, imageId);
        return CommentResponses.from(comments);
    }

    @GetMapping("/{comment_id}")
    @SwaggerApiSuccess(description = "댓글을 성공적으로 조회합니다.")
    @Operation(summary = "댓글 조회", description = "댓글을 조회합니다.")
    @SwaggerApiError({ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    public CommentResponse getCommentById(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("comment_id") final Integer commentId) {
        return commentService.getCommentById(memberId, projectId, commentId);
    }

    @PostMapping("/images/{image_id}")
    @SwaggerApiSuccess(description = "댓글을 성공적으로 생성합니다.")
    @Operation(summary = "댓글 생성", description = "댓글을 생성합니다.")
    @SwaggerApiError({ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    public CommentResponse createComment(
            @RequestBody final CommentRequest commentRequest,
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("image_id") final Long imageId) {
        return commentService.createComment(commentRequest, memberId, projectId, imageId);
    }

    @PutMapping("/{comment_id}")
    @SwaggerApiSuccess(description = "댓글을 성공적으로 수정합니다.")
    @Operation(summary = "댓글 수정", description = "댓글을 수정합니다.")
    @SwaggerApiError({ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    public CommentResponse updateComment(
            @RequestBody final CommentRequest commentRequest,
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("comment_id") final Integer commentId) {
        return commentService.updateComment(commentRequest, memberId, projectId, commentId);
    }

    @DeleteMapping("/{comment_id}")
    @SwaggerApiSuccess(description = "댓글을 성공적으로 생성합니다.")
    @Operation(summary = "댓글 생성", description = "댓글을 생성합니다.")
    @SwaggerApiError({ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    public void deleteComment(
            @CurrentUser final Integer memberId,
            @PathVariable("project_id") final Integer projectId,
            @PathVariable("comment_id") final Integer commentId) {
        commentService.deleteComment(memberId, projectId, commentId);
    }
}
