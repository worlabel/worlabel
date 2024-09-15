package com.worlabel.domain.review.service;

import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.entity.dto.ImageResponse;
import com.worlabel.domain.image.repository.ImageRepository;
import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.member.repository.MemberRepository;
import com.worlabel.domain.participant.service.ParticipantService;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.repository.ProjectRepository;
import com.worlabel.domain.review.entity.Review;
import com.worlabel.domain.review.entity.ReviewImage;
import com.worlabel.domain.review.entity.ReviewStatus;
import com.worlabel.domain.review.entity.dto.ReviewDetailResponse;
import com.worlabel.domain.review.entity.dto.ReviewRequest;
import com.worlabel.domain.review.entity.dto.ReviewResponse;
import com.worlabel.domain.review.entity.dto.ReviewStatusRequest;
import com.worlabel.domain.review.repository.ReviewImageRepository;
import com.worlabel.domain.review.repository.ReviewRepository;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewImageRepository reviewImageRepository;
    private final ImageRepository imageRepository;
    private final MemberRepository memberRepository;
    private final ProjectRepository projectRepository;
    private final ParticipantService participantService;

    public ReviewResponse createReview(final Integer memberId, final Integer projectId, final ReviewRequest reviewRequest) {
        // 권한 체크 편집자 이상만 리뷰 신청 가능
        participantService.checkEditorUnauthorized(memberId, projectId);

        Project project = getProject(projectId);
        Member member = getMember(memberId);

        // 리뷰 생성
        Review review = Review.of(reviewRequest.getTitle(), reviewRequest.getContent(), member, project, ReviewStatus.REQUESTED);
        reviewRepository.save(review);

        // 이미지 리스트 조회
        List<Image> images = imageRepository.findAllById(reviewRequest.getImageIds());

        if (images.size() != reviewRequest.getImageIds().size()) {
            throw new CustomException(ErrorCode.IMAGE_NOT_FOUND);
        }

        // 리뷰 이미지 객체 생성 및 배치 저장
        List<ReviewImage> reviewImages = images.stream()
            .map(image -> ReviewImage.of(review, image))
            .collect(Collectors.toList());

        reviewImageRepository.saveAll(reviewImages);

        return ReviewResponse.from(review);
    }

    // 리뷰 조회
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewByProjectId(final Integer memberId, final Integer projectId, final ReviewStatusRequest reviewStatusRequest) {
        participantService.checkViewerUnauthorized(memberId, projectId);

        return reviewRepository.findAllByProjectIdAndReviewStatus(projectId, reviewStatusRequest.getReviewStatus()).stream()
            .map(ReviewResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public ReviewDetailResponse getReviewById(final Integer memberId, final Integer projectId, final Integer reviewId) {
        participantService.checkViewerUnauthorized(memberId, projectId);

        Review review = getReview(reviewId);

        List<ImageResponse> images = reviewImageRepository.findAllByReviewIdWithImage(reviewId).stream()
            .map(reviewImage -> ImageResponse.from(reviewImage.getImage()))
            .toList();

        return ReviewDetailResponse.of(review, images);
    }

    public ReviewResponse updateReview(final Integer memberId, final Integer reviewId, final ReviewRequest reviewUpdateRequest) {
        Review review = getReviewWithMemberId(reviewId, memberId);

        // 기존 리뷰 이미지 삭제 후 새로 등록
        reviewImageRepository.deleteAllByReview(review);
        List<Image> images = imageRepository.findAllById(reviewUpdateRequest.getImageIds());
        List<ReviewImage> reviewImages = images.stream()
            .map(image -> ReviewImage.of(review, image))
            .collect(Collectors.toList());

        reviewImageRepository.saveAll(reviewImages);

        review.updateReview(reviewUpdateRequest.getTitle(), reviewUpdateRequest.getContent());

        return ReviewResponse.from(review);
    }

    // 상태 변경
    public ReviewResponse updateReviewStatus(final Integer memberId, final Integer projectId, final Integer reviewId, final ReviewStatusRequest reviewStatusRequest) {
        participantService.checkManagerUnauthorized(memberId, projectId);

        Review review = getReview(reviewId);
        review.updateReviewStatus(reviewStatusRequest.getReviewStatus());

        return ReviewResponse.from(review);
    }

    // 리뷰 삭제
    public void deleteReview(final Integer memberId, final Integer reviewId) {
        Review review = getReviewWithMemberId(reviewId, memberId);

        reviewImageRepository.deleteAllByReview(review);
        reviewRepository.delete(review);
    }

    private Member getMember(final Integer memberId) {
        return memberRepository.findById(memberId)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    private Project getProject(final Integer projectId) {
        return projectRepository.findById(projectId)
            .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));
    }

    private Review getReview(final Integer reviewId) {
        return reviewRepository.findById(reviewId)
            .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));
    }

    private Review getReviewWithMemberId(final Integer reviewId, final Integer memberId) {
        return reviewRepository.findByIdAndMemberId(reviewId, memberId)
            .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));
    }
}
