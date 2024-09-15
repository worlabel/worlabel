package com.worlabel.domain.review.entity.dto;

import com.worlabel.domain.image.entity.dto.ImageResponse;
import com.worlabel.domain.review.entity.Review;
import com.worlabel.domain.review.entity.ReviewStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Schema(name = "리뷰 디테일 응답 DTO", description = "리뷰 디테일 응답 DTO")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ReviewDetailResponse {

    @Schema(description = "리뷰 ID", example = "1")
    private Integer reviewId;

    @Schema(description = "리뷰 제목", example = "확인 부탁드립니다.")
    private String title;

    @Schema(description = "리뷰 내용", example = "수정했는데 전체적으로 확인 부탁드립니다.")
    private String content;

    @Schema(description = "리뷰 상태", example = "요청")
    private ReviewStatus reviewStatus;

    @Schema(description = "이미지 목록", example = "")
    private List<ImageResponse> images;

    public static ReviewDetailResponse of(final Review review, final List<ImageResponse> images) {
        return new ReviewDetailResponse(review.getId(), review.getTitle(), review.getContent(), review.getReviewStatus(), images);
    }
}
