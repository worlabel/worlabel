package com.worlabel.domain.review.entity.dto;

import com.worlabel.domain.member.entity.dto.MemberDetailResponse;
import com.worlabel.domain.review.entity.Review;
import com.worlabel.domain.review.entity.ReviewStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Schema(name = "리뷰 응답 DTO", description = "리뷰 응답 DTO")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ReviewResponse {

    @Schema(description = "리뷰 ID", example = "1")
    private Integer reviewId;

    @Schema(description = "프로젝트 ID", example = "2")
    private Integer projectId;

    @Schema(description = "리뷰 제목", example = "확인 부탁드립니다.")
    private String title;

    @Schema(description = "리뷰 내용", example = "확인 부탁드립니다.")
    private String content;

    @Schema(description = "리뷰 상태", example = "요청")
    private ReviewStatus status;

    @Schema(description = "작성자 정보", example = "")
    private MemberDetailResponse author;

    @Schema(description = "리뷰 작성일", example = "")
    private LocalDateTime createdAt;

    @Schema(description = "리뷰 수정일", example = "")
    private LocalDateTime updatedAt;

    public static ReviewResponse from(final Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getProject().getId(),
                review.getTitle(),
                review.getContent(),
                review.getReviewStatus(),
                MemberDetailResponse.of(review.getMember()),
                review.getCreatedAt(),
                review.getUpdatedAt());
    }
}

