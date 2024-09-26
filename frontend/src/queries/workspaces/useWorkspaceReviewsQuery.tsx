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
    queryKey: ['workspaceReviews', workspaceId, memberId, reviewStatus, sortDirection],
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
        const lastReview = lastPage[lastPage.length - 1];

        return lastReview.reviewId;
      }
    },

    refetchOnMount: true,
    refetchOnWindowFocus: false,
    initialPageParam: undefined,
  });
}
