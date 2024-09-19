import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview, updateReview, deleteReview, updateReviewStatus } from '@/api/reviewApi';
import { ReviewRequest, ReviewResponse } from '@/types';

// 리뷰 생성 훅
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation<ReviewResponse, Error, { projectId: number; memberId: number; reviewData: ReviewRequest }>({
    mutationFn: ({ projectId, memberId, reviewData }) => createReview(projectId, memberId, reviewData),
    onSuccess: (_, { projectId, memberId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviewList', projectId, memberId] });
    },
  });
};

// 리뷰 수정 훅
export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ReviewResponse,
    Error,
    { projectId: number; reviewId: number; memberId: number; reviewData: ReviewRequest }
  >({
    mutationFn: ({ projectId, reviewId, memberId, reviewData }) =>
      updateReview(projectId, reviewId, memberId, reviewData),
    onSuccess: (_, { projectId, reviewId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviewDetail', projectId, reviewId] });
    },
  });
};

// 리뷰 삭제 훅
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { projectId: number; reviewId: number; memberId: number }>({
    mutationFn: ({ projectId, reviewId, memberId }) => deleteReview(projectId, reviewId, memberId),
    onSuccess: (_, { projectId, reviewId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviewDetail', projectId, reviewId] });
    },
  });
};

// 리뷰 상태 변경 훅
export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ReviewResponse,
    Error,
    { projectId: number; reviewId: number; memberId: number; reviewStatus: string }
  >({
    mutationFn: ({ projectId, reviewId, memberId, reviewStatus }) =>
      updateReviewStatus(projectId, reviewId, memberId, reviewStatus),
    onSuccess: (_, { projectId, reviewId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviewDetail', projectId, reviewId] });
    },
  });
};
