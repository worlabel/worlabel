import api from '@/api/axiosConfig';
import { ReviewDetailResponse, ReviewRequest, ReviewResponse } from '@/types';

// 리뷰 단건 조회
export async function getReviewDetail(projectId: number, reviewId: number, memberId: number) {
  return api
    .get<ReviewDetailResponse>(`/projects/${projectId}/reviews/${reviewId}`, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

// 리뷰 생성
export async function createReview(projectId: number, memberId: number, reviewData: ReviewRequest) {
  return api
    .post<ReviewResponse>(`/projects/${projectId}/reviews`, reviewData, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

// 리뷰 수정
export async function updateReview(projectId: number, reviewId: number, memberId: number, reviewData: ReviewRequest) {
  return api
    .put<ReviewResponse>(`/projects/${projectId}/reviews/${reviewId}`, reviewData, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

// 리뷰 삭제
export async function deleteReview(projectId: number, reviewId: number, memberId: number) {
  return api
    .delete(`/projects/${projectId}/reviews/${reviewId}`, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

// 리뷰 상태 변경
export async function updateReviewStatus(projectId: number, reviewId: number, memberId: number, reviewStatus: string) {
  return api
    .put<ReviewResponse>(
      `/projects/${projectId}/reviews/${reviewId}/status`,
      { reviewStatus },
      {
        params: { memberId },
      }
    )
    .then(({ data }) => data);
}

export async function getReviewByStatus(
  projectId: number,
  memberId: number,
  reviewStatus?: 'REQUESTED' | 'APPROVED' | 'REJECTED',
  lastReviewId?: number,
  limitPage: number = 10
) {
  return api
    .get<ReviewResponse[]>(`/projects/${projectId}/reviews`, {
      params: {
        memberId,
        limitPage,
        ...(reviewStatus ? { reviewStatus } : {}),
        ...(lastReviewId ? { lastReviewId } : {}),
      },
    })
    .then(({ data }) => data);
}
