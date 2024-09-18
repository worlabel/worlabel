package com.worlabel.domain.review.entity.dto;

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

    @Schema(description = "리뷰 제목", example = "확인 부탁드립니다.")
    private String title;

    @Schema(description = "리뷰 내용", example = "확인 부탁드립니다.")
    private String content;

    @Schema(description = "리뷰 상태", example = "요청")
    private ReviewStatus status;

    @Schema(description = "작성자 닉네임", example = "javajoha")
    private String nickname;

    @Schema(description = "작성자 이메일", example = "jaa@naver.com")
    private String email;

    @Schema(description = "리뷰 작성일", example = "")
    private LocalDateTime createAt;

    @Schema(description = "리뷰 수정일", example = "")
    private LocalDateTime updateAt;

    public static ReviewResponse from(final Review review) {
        return new ReviewResponse(
            review.getId(),
            review.getTitle(),
            review.getContent(),
            review.getReviewStatus(),
            review.getMember().getNickname(),
            review.getMember().getEmail(),
            review.getCreatedAt(),
            review.getUpdatedAt());
    }
}

