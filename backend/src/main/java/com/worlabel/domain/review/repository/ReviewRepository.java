package com.worlabel.domain.review.repository;

import com.worlabel.domain.review.entity.Review;
import com.worlabel.domain.review.entity.ReviewStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

    List<Review> findAllByProjectId(Integer projectId);

    List<Review> findAllByProjectIdAndReviewStatus(Integer projectId, ReviewStatus reviewStatus);

    Optional<Review> findByIdAndMemberId(Integer reviewId, Integer memberId);

    @Query("SELECT r, m " +
        "FROM Review r JOIN Member m ON r.id = m.id " +
        "WHERE r.project.id = :projectId AND (:reviewStatus IS NULL OR r.reviewStatus = :reviewStatus) AND (:lastReviewId IS NULL OR r.id < :lastReviewId) " +
        "ORDER BY r.id DESC LIMIT :limit")
    List<Review> findReviewsNativeWithLimit(
        @Param("projectId") Integer projectId,
        @Param("reviewStatus") ReviewStatus reviewStatus,
        @Param("lastReviewId") Integer lastReviewId,
        @Param("limit") Integer limit
    );
}
