import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getWorkspaceReviews } from '@/api/workspaceApi';
import { ReviewResponse } from '@/types';

export default function useWorkspaceReviewsQuery(
  workspaceId: number,
  memberId: number,
  sortDirection: number,
  reviewStatus?: 'REQUESTED' | 'APPROVED' | 'REJECTED',
  limitPage: number = 10
) {
  return useSuspenseInfiniteQuery<ReviewResponse[]>({
    queryKey: ['workspaceReviews', workspaceId, reviewStatus, sortDirection],
    queryFn: ({ pageParam = undefined }) =>
      getWorkspaceReviews(
        workspaceId,
        memberId,
        sortDirection,
        reviewStatus,
        pageParam as number | undefined,
        limitPage
      ),

    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined;

      if (sortDirection === 0) {
        const lastReview = lastPage[lastPage.length - 1];
        return lastReview.reviewId;
      } else {
        const firstReview = lastPage[0];
        return firstReview.reviewId;
      }
    },

    getPreviousPageParam: (firstPage) => {
      if (firstPage.length === 0) return undefined;

      if (sortDirection === 0) {
        const firstReview = firstPage[0];
        return firstReview.reviewId;
      } else {
        const lastReview = firstPage[firstPage.length - 1];
        return lastReview.reviewId;
      }
    },

    initialPageParam: undefined,
  });
}
