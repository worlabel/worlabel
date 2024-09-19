package com.worlabel.domain.comment.service;

import com.worlabel.domain.comment.entity.Comment;
import com.worlabel.domain.comment.entity.dto.CommentRequest;
import com.worlabel.domain.comment.entity.dto.CommentResponse;
import com.worlabel.domain.comment.repository.CommentRepository;
import com.worlabel.domain.folder.entity.Folder;
import com.worlabel.domain.folder.repository.FolderRepository;
import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.repository.ImageRepository;
import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.member.repository.MemberRepository;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.global.annotation.CheckPrivilege;
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
    private final MemberRepository memberRepository;
    private final ImageRepository imageRepository;
    private final FolderRepository folderRepository;

    @Transactional(readOnly = true)
    @CheckPrivilege(PrivilegeType.VIEWER)
    public List<CommentResponse> getAllComments(final Integer memberId, final Integer projectId, final Long imageId) {
        checkImageProjectRelation(imageId, projectId);

        return commentRepository.findByImageId(imageId).stream()
                .map(CommentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    @CheckPrivilege(PrivilegeType.VIEWER)
    public CommentResponse getCommentById(final Integer memberId, final Integer projectId, final Integer commentId) {
        Comment comment = getComment(commentId);
        checkImageProjectRelation(comment.getImage().getId(), projectId);

        return CommentResponse.from(comment);
    }

    @CheckPrivilege(PrivilegeType.VIEWER)
    public CommentResponse createComment(final CommentRequest commentRequest, final Integer memberId, final Integer projectId, final Long imageId) {
        Member member = getMember(memberId);
        Image image = getImage(imageId, projectId);

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

    /**
     * 이미지가 해당 프로젝트에 속하는지 검증
     */
    private void checkImageProjectRelation(final Long imageId, final Integer projectId) {
        // imageId
        if (imageRepository.findByIdAndProjectId(imageId, projectId).isEmpty()) {
            throw new CustomException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    /**
     * 코멘트가 속한 이미지가 해당 프로젝트에 속하는지 검증
     */
    private void checkAuthorizedAndCommentProjectRelation(final Integer projectId, final Integer commentId) {
        Comment comment = getComment(commentId);
        Image image = comment.getImage();

        if (imageRepository.findByIdAndProjectId(image.getId(), projectId).isEmpty()) {
            throw new CustomException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    private Comment getComment(final Integer commentId) {
        return commentRepository.findByCommentId(commentId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }

    private Comment getCommentWithMemberId(final Integer commentId, final Integer memberId) {
        return commentRepository.findByIdAndMemberId(commentId, memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }

    private Member getMember(final Integer memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    private Image getImage(final Long imageId, final Integer projectId) {
        return imageRepository.findByIdAndProjectId(imageId, projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }
}
