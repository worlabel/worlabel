package com.worlabel.domain.review.service;

import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.entity.LabelStatus;
import com.worlabel.domain.image.entity.dto.ImageResponse;
import com.worlabel.domain.image.repository.ImageRepository;
import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.member.repository.MemberRepository;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.repository.ProjectRepository;
import com.worlabel.domain.review.entity.Review;
import com.worlabel.domain.review.entity.ReviewImage;
import com.worlabel.domain.review.entity.ReviewStatus;
import com.worlabel.domain.review.entity.dto.ReviewDetailResponse;
import com.worlabel.domain.review.entity.dto.ReviewRequest;
import com.worlabel.domain.review.entity.dto.ReviewResponse;
import com.worlabel.domain.review.repository.ReviewImageRepository;
import com.worlabel.domain.review.repository.ReviewRepository;
import com.worlabel.global.annotation.CheckPrivilege;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewImageRepository reviewImageRepository;
    private final ImageRepository imageRepository;
    private final MemberRepository memberRepository;
    private final ProjectRepository projectRepository;

    @CheckPrivilege(PrivilegeType.EDITOR)
    public ReviewResponse createReview(final Integer memberId, final Integer projectId, final ReviewRequest reviewRequest) {
        Project project = getProject(projectId);
        Member member = getMember(memberId);

        // 리뷰 생성
        Review review = Review.of(reviewRequest.getTitle(), reviewRequest.getContent(), member, project, ReviewStatus.REQUESTED);
        reviewRepository.save(review);

        // 이미지 리스트 조회
        List<Image> imageList = imageRepository.findSaveImageByIds(reviewRequest.getImageIds());
        log.debug("{}",imageList);
        if (imageList.size() != reviewRequest.getImageIds().size()) {
            throw new CustomException(ErrorCode.DATA_NOT_FOUND);
        }

        // 리뷰 이미지 객체 생성 및 배치 저장
        List<ReviewImage> reviewImageList = new ArrayList<>();
        for (Image image : imageList) {
            image.updateStatus(LabelStatus.REVIEW_REQUEST);
            reviewImageList.add(ReviewImage.of(review, image));
        }

        reviewImageRepository.saveAll(reviewImageList);
        return ReviewResponse.from(review);
    }

    @Transactional(readOnly = true)
    @CheckPrivilege(PrivilegeType.VIEWER)
    public List<ReviewResponse> getReviewByProjectId(final Integer projectId, final String reviewStatusRequest, final Integer lastReviewId, final Integer limitPage, final Integer sort) {
        // 리뷰 조회 쿼리 호출
        List<Review> reviews;

        if (sort == 0) {
            reviews = reviewRepository.findReviewsNativeWithLimit(
                    projectId,
                    reviewStatusRequest == null ? null : ReviewStatus.valueOf(reviewStatusRequest),
                    lastReviewId,
                    limitPage
            );
        } else {
            reviews = reviewRepository.findReviewsNativeSortWithLimit(
                    projectId,
                    reviewStatusRequest == null ? null : ReviewStatus.valueOf(reviewStatusRequest),
                    lastReviewId,
                    limitPage
            );
        }

        // ReviewResponse로 변환
        return reviews.stream()
                .map(ReviewResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    @CheckPrivilege(PrivilegeType.VIEWER)
    public ReviewDetailResponse getReviewById(final Integer projectId, final Integer reviewId) {
        Review review = getReviewWithMember(reviewId);

        List<ImageResponse> images = reviewImageRepository.findAllByReviewIdWithImage(reviewId).stream()
                .map(reviewImage -> ImageResponse.from(reviewImage.getImage()))
                .toList();

        return ReviewDetailResponse.of(review, images);
    }

    public ReviewResponse updateReview(final Integer memberId, final Integer reviewId, final ReviewRequest reviewUpdateRequest) {
        deleteReview(memberId, reviewId);
        return createReview(memberId, reviewId, reviewUpdateRequest);
    }

    // 상태 변경
    @CheckPrivilege(PrivilegeType.MANAGER)
    public void approveReview(final Integer memberId, final Integer projectId, final Integer reviewId) {
        Member member = getMember(memberId);
        Review review = getRequestReview(reviewId);

        updateReviewAndImages(member, review, LabelStatus.COMPLETED, ReviewStatus.APPROVED);
    }

    @CheckPrivilege(PrivilegeType.MANAGER)
    public void rejectReview(Integer memberId, Integer projectId, Integer reviewId) {
        Member member = getMember(memberId);
        Review review = getRequestReview(reviewId);

        updateReviewAndImages(member, review, LabelStatus.REVIEW_REJECT, ReviewStatus.REJECTED);
    }

    public void updateReviewAndImages(final Member member,final Review review,final LabelStatus labelStatus,final ReviewStatus reviewStatus) {
        // 이미지 상태 업데이트
        List<Image> imageList = reviewImageRepository.findImageAllByReviewId(review.getId());
        imageList.forEach(image -> image.updateStatus(labelStatus));

        // 리뷰 상태 및 리뷰어 업데이트
        review.updateReviewStatus(reviewStatus);
        review.assignReviewer(member);
    }
    // 리뷰 삭제
    public void deleteReview(final Integer memberId, final Integer reviewId) {
        Review review = getReviewWithMemberId(reviewId, memberId);

        List<Image> imageList = reviewImageRepository.findImageAllByReviewId(reviewId);
        imageList.forEach(image -> image.updateStatus(LabelStatus.SAVE));

        imageRepository.saveAll(imageList);
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

    private Review getRequestReview(final Integer reviewId) {
        return reviewRepository.findByIdAndRequested(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }

    private Review getReview(final Integer reviewId) {
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }

    private Review getReviewWithMember(final Integer reviewId) {
        return reviewRepository.findByIdFetchMemberAndReviewer(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }

    private Review getReviewWithMemberId(final Integer reviewId, final Integer memberId) {
        return reviewRepository.findByIdAndMemberId(reviewId, memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }

}
