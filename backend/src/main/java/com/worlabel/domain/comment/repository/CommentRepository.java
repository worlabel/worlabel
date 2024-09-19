package com.worlabel.domain.comment.repository;

import com.worlabel.domain.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {

    @Query("SELECT c FROM Comment c " +
            "JOIN FETCH c.image " +
            "JOIN FETCH c.member " +
            "WHERE c.image.id = :imageId")
    List<Comment> findByImageId(@Param("imageId") Long imageId);

    Optional<Comment> findByIdAndMemberId(Integer commentId, Integer memberId);

    @Query("SELECT c FROM Comment c " +
            "JOIN FETCH c.member " +
            "JOIN FETCH c.image " +
            "WHERE c.id = :commentId")
    Optional<Comment> findByCommentId(@Param("commentId") Integer commentId);
}
