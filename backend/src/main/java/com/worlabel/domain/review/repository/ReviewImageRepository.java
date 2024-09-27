package com.worlabel.domain.review.repository;

import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.review.entity.Review;
import com.worlabel.domain.review.entity.ReviewImage;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewImageRepository extends JpaRepository<ReviewImage, Integer> {

    // 페치 조인으로 리뷰 이미지와 관련된 이미지를 한 번에 조회
    @Query("SELECT ri FROM ReviewImage ri JOIN FETCH ri.image WHERE ri.review.id = :reviewId")
    List<ReviewImage> findAllByReviewIdWithImage(@Param("reviewId") Integer reviewId);

    void deleteAllByReview(Review review);


    @Query("SELECT ri.image from ReviewImage ri " +
            "WHERE ri.review.id = :reviewId ")
    List<Image> findImageAllByReviewId(@Param("reviewId") int reviewId);
}
