import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getWorkspaceReviews } from '@/api/workspaceApi';
import { ReviewResponse } from '@/types';

export default function useWorkspaceReviewsQuery(
  workspaceId: number,
  memberId: number,
  reviewStatus?: 'REQUESTED' | 'APPROVED' | 'REJECTED',
  limitPage: number = 10
) {
  return useSuspenseInfiniteQuery<ReviewResponse[]>({
    queryKey: ['workspaceReviews', workspaceId, reviewStatus],
    queryFn: ({ pageParam = undefined }) =>
      getWorkspaceReviews(workspaceId, memberId, reviewStatus, pageParam as number | undefined, limitPage),

    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined;
      const lastReview = lastPage[lastPage.length - 1];
      return lastReview.reviewId;
    },

    initialPageParam: undefined,
  });
}
