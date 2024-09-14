package com.worlabel.domain.review.entity.dto;

import com.worlabel.domain.review.entity.ReviewStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Schema(name = "리뷰 상태 요청 DTO", description = "리뷰 상태 요청 DTO")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewStatusRequest {

    @Schema(description = "리뷰 상태", example = "거부")
    @NotNull(message = "상태를 입력하세요.")
    private ReviewStatus reviewStatus;
}
