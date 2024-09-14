package com.worlabel.domain.review.repository;

import com.worlabel.domain.review.entity.Review;
import com.worlabel.domain.review.entity.ReviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

    List<Review> findAllByProjectId(Integer projectId);

    List<Review> findAllByProjectIdAndReviewStatus(Integer projectId, ReviewStatus reviewStatus);

    Optional<Review> findByIdAndMemberId(Integer reviewId, Integer memberId);
}
