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

    @Query("SELECT r " +
            "FROM Review r " +
            "WHERE r.project.id = :projectId AND (:reviewStatus IS NULL OR r.reviewStatus = :reviewStatus) AND (:lastReviewId IS NULL OR r.id < :lastReviewId) " +
            "ORDER BY r.id DESC LIMIT :limit")
    List<Review> findReviewsNativeWithLimit(
            @Param("projectId") Integer projectId,
            @Param("reviewStatus") ReviewStatus reviewStatus,
            @Param("lastReviewId") Integer lastReviewId,
            @Param("limit") Integer limit
    );

    @Query("SELECT r " +
            "FROM Review r " +
            "WHERE r.project.id = :projectId AND (:reviewStatus IS NULL OR r.reviewStatus = :reviewStatus) AND (:lastReviewId IS NULL OR r.id > :lastReviewId) " +
            "ORDER BY r.id LIMIT :limit")
    List<Review> findReviewsNativeSortWithLimit(
            @Param("projectId") Integer projectId,
            @Param("reviewStatus") ReviewStatus reviewStatus,
            @Param("lastReviewId") Integer lastReviewId,
            @Param("limit") Integer limit
    );

    // Fetch join을 사용하여 reviewId로 조회하면서 Member와 Reviewer 정보를 가져오는 쿼리
    @Query("SELECT r FROM Review r " +
            "JOIN FETCH r.member " +    // 작성자 정보
            "LEFT JOIN FETCH r.reviewer " +  // 리뷰어 정보 (없을 수도 있으므로 LEFT JOIN)
            "WHERE r.id = :reviewId")
    Optional<Review> findByIdFetchMemberAndReviewer(@Param("reviewId") Integer reviewId);

    @Query(value = """
            SELECT r.* 
            FROM review r
            JOIN project p ON r.project_id = p.project_id
            JOIN participant part ON part.project_id = p.project_id
            WHERE p.workspace_id = :workspaceId
            AND part.member_id = :memberId
            AND (:status IS NULL OR r.status = :status)
            AND (:lastReviewId IS NULL OR r.review_id < :lastReviewId)
            ORDER BY r.review_id DESC
            LIMIT :limitPage
            """, nativeQuery = true)
    List<Review> findAllReviewsByWorkspaceAndMember(
            @Param("workspaceId") Integer workspaceId,
            @Param("memberId") Integer memberId,
            @Param("status") String status,
            @Param("lastReviewId") Integer lastReviewId,
            @Param("limitPage") Integer limitPage
    );

    @Query(value = """
            SELECT r.* 
            FROM review r
            JOIN project p ON r.project_id = p.project_id
            JOIN participant part ON part.project_id = p.project_id
            WHERE p.workspace_id = :workspaceId
            AND part.member_id = :memberId
            AND (:status IS NULL OR r.status = :status)
            AND (:lastReviewId IS NULL OR r.review_id > :lastReviewId)
            ORDER BY r.review_id 
            LIMIT :limitPage
            """, nativeQuery = true)
    List<Review> findAllReviewsByWorkspaceAndMemberDesc(
            @Param("workspaceId") Integer workspaceId,
            @Param("memberId") Integer memberId,
            @Param("status") String status,
            @Param("lastReviewId") Integer lastReviewId,
            @Param("limitPage") Integer limitPage
    );

}
