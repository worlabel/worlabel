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

    @Query(value = "SELECT r.*, m.* " +
        "FROM review r JOIN member m ON r.member_id = m.member_id " +
        "WHERE r.project_id = :projectId AND (:reviewStatus IS NULL OR r.status = :reviewStatus) AND (:lastReviewId IS NULL OR r.review_id < :lastReviewId) " +
        "ORDER BY r.review_id DESC LIMIT :limit", nativeQuery = true)
    List<Review> findReviewsNativeWithLimit(
        @Param("projectId") Integer projectId,
        @Param("reviewStatus") String reviewStatus,
        @Param("lastReviewId") Integer lastReviewId,
        @Param("limit") Integer limit
    );
}
