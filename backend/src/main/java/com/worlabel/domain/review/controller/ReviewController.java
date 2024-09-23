package com.worlabel.domain.review.controller;

import com.worlabel.domain.review.entity.dto.ReviewDetailResponse;
import com.worlabel.domain.review.entity.dto.ReviewRequest;
import com.worlabel.domain.review.entity.dto.ReviewResponse;
import com.worlabel.domain.review.entity.dto.ReviewStatusRequest;
import com.worlabel.domain.review.service.ReviewService;
import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{project_id}/reviews")
@RequiredArgsConstructor
@Tag(name = "리뷰 관련 API")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @SwaggerApiSuccess(description = "리뷰를 성공적으로 생성합니다.")
    @Operation(summary = "리뷰 생성", description = "리뷰를 생성합니다..")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.PARTICIPANT_UNAUTHORIZED, ErrorCode.SERVER_ERROR})
    public ReviewResponse createReview(
        @CurrentUser final Integer memberId,
        @PathVariable("project_id") final Integer projectId,
        @RequestBody @Validated final ReviewRequest reviewRequest) {
        return reviewService.createReview(memberId, projectId, reviewRequest);
    }

    // 리뷰 조회(상태별로)
    @GetMapping
    @SwaggerApiSuccess(description = "리뷰를 상태별로 성공적으로 조회합니다.")
    @Operation(summary = "리뷰를 상태별로 조회", description = "리뷰를 상태별로 조회합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.PARTICIPANT_UNAUTHORIZED, ErrorCode.SERVER_ERROR})
    public List<ReviewResponse> getReviewByProject(
        @PathVariable("project_id") final Integer projectId,
        @Parameter(name = "리뷰 상태", description = "리뷰 상태", example = "APPROVED") @RequestParam(value = "reviewStatus", required = false) final String reviewStatusRequest,
        @Parameter(name = "마지막 리뷰 id", description = "마지막 리뷰 id를 넣으면 그 아래 부터 가져옴, 넣지않으면 가장 최신", example = "1") @RequestParam(required = false) Integer lastReviewId,
        @Parameter(name = "가져올 리뷰 수", description = "가져올 리뷰 수 default = 10", example = "20") @RequestParam(defaultValue = "10") Integer limitPage) {
        return reviewService.getReviewByProjectId(projectId, reviewStatusRequest, lastReviewId, limitPage);
    }

    // 리뷰 단건 조회
    @GetMapping("/{review_id}")
    @SwaggerApiSuccess(description = "리뷰 단건을 성공적으로 조회합니다.")
    @Operation(summary = "리뷰 단건 조회", description = "리뷰 단건 조회합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.PARTICIPANT_UNAUTHORIZED, ErrorCode.SERVER_ERROR})
    public ReviewDetailResponse getReviewById(
        @PathVariable("project_id") final Integer projectId,
        @PathVariable("review_id") final Integer reviewId) {
        return reviewService.getReviewById(projectId, reviewId);
    }

    // 리뷰 수정
    @PutMapping("/{review_id}")
    @SwaggerApiSuccess(description = "리뷰를 성공적으로 수정합니다.")
    @Operation(summary = "리뷰를 수정", description = "리뷰를 수정합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.PARTICIPANT_UNAUTHORIZED, ErrorCode.SERVER_ERROR})
    public ReviewResponse updateReview(
        @CurrentUser final Integer memberId,
        @PathVariable("project_id") final Integer projectId,
        @PathVariable("review_id") final Integer reviewId,
        @RequestBody ReviewRequest reviewUpdateRequest) {
        return reviewService.updateReview(memberId, reviewId, reviewUpdateRequest);
    }

    // 리뷰 상태 수정
    @PutMapping("/{review_id}/status")
    @SwaggerApiSuccess(description = "리뷰상태를 성공적으로 수정합니다.")
    @Operation(summary = "리뷰 상태를 수정", description = "리뷰 상태를 수정합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.PARTICIPANT_UNAUTHORIZED, ErrorCode.SERVER_ERROR})
    public ReviewResponse updateReviewStatus(
        @CurrentUser final Integer memberId,
        @PathVariable("project_id") final Integer projectId,
        @PathVariable("review_id") final Integer reviewId,
        @RequestBody ReviewStatusRequest reviewStatusRequest) {
        return reviewService.updateReviewStatus(memberId, projectId, reviewId, reviewStatusRequest);
    }

    // 리뷰 삭제
    @DeleteMapping("/{review_id}")
    @SwaggerApiSuccess(description = "리뷰를 성공적으로 삭제합니다.")
    @Operation(summary = "리뷰를 삭제", description = "리뷰를 삭제합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.PARTICIPANT_UNAUTHORIZED, ErrorCode.SERVER_ERROR})
    public void deleteReview(
        @CurrentUser final Integer memberId,
        @PathVariable("project_id") final Integer projectId,
        @PathVariable("review_id") final Integer reviewId) {
        reviewService.deleteReview(memberId, reviewId);
    }
}
