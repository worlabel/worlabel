package com.worlabel.domain.comment.repository;

import com.worlabel.domain.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {

    List<Comment> findByImageId(Long image_id);

    Optional<Comment> findByIdAndMemberId(Integer commentId, Integer memberId);
}
