package com.worlabel.domain.comment.service;

import com.worlabel.domain.comment.entity.Comment;
import com.worlabel.domain.comment.entity.dto.CommentRequest;
import com.worlabel.domain.comment.entity.dto.CommentResponse;
import com.worlabel.domain.comment.repository.CommentRepository;
import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.repository.ImageRepository;
import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.member.repository.MemberRepository;
import com.worlabel.domain.participant.repository.ParticipantRepository;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final ParticipantRepository participantRepository;
    private final MemberRepository memberRepository;
    private final ImageRepository imageRepository;

    @Transactional(readOnly = true)
    public List<CommentResponse> getAllComments(final Integer memberId, final Integer projectId, final Long imageId) {
        checkAuthorized(memberId, projectId);

        return commentRepository.findByImageId(imageId).stream()
                .map(CommentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CommentResponse getCommentById(final Integer memberId, final Integer projectId, final Integer commentId) {
        checkAuthorized(memberId, projectId);
        Comment comment = getComment(commentId);

        return CommentResponse.from(comment);
    }

    public CommentResponse createComment(final CommentRequest commentRequest, Integer memberId, final Integer projectId, final Long imageId) {
        checkAuthorized(memberId, projectId);
        Member member = getMember(memberId);
        Image image = getImage(imageId);

        Comment comment = Comment.of(commentRequest.getContent(), commentRequest.getPositionX(), commentRequest.getPositionY(), member, image);
        comment = commentRepository.save(comment);

        return CommentResponse.from(comment);
    }

    public CommentResponse updateComment(final CommentRequest commentRequest, final Integer memberId, final Integer projectId, final Integer commentId) {
        Comment comment = getCommentWithMemberId(commentId, memberId);
        comment.update(commentRequest.getContent(), commentRequest.getPositionX(), commentRequest.getPositionY());

        return CommentResponse.from(comment);
    }

    public void deleteComment(final Integer memberId, final Integer projectId, final Integer commentId) {
        Comment comment = getCommentWithMemberId(commentId, memberId);
        commentRepository.delete(comment);
    }

    private void checkAuthorized(final Integer memberId, final Integer projectId) {
        if (!participantRepository.existsByMemberIdAndProjectId(memberId, projectId)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
    }

    private Comment getComment(final Integer commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));
    }

    private Comment getCommentWithMemberId(final Integer commentId, final Integer memberId) {
        return commentRepository.findByIdAndMemberId(commentId, memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));
    }

    private Member getMember(final Integer memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    private Image getImage(final Long imageId) {
        return imageRepository.findById(imageId)
                .orElseThrow(() -> new CustomException(ErrorCode.IMAGE_NOT_FOUND));
    }
}
