import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getReviewByStatus } from '@/api/reviewApi';
import { ReviewResponse } from '@/types';

export default function useReviewByStatusQuery(
  projectId: number,
  memberId: number,
  reviewStatus: 'REQUESTED' | 'APPROVED' | 'REJECTED' | undefined,
  sortDirection: number
) {
  return useSuspenseInfiniteQuery<ReviewResponse[]>({
    queryKey: ['reviewByStatus', projectId, reviewStatus, sortDirection],
    queryFn: ({ pageParam = undefined }) => {
      return getReviewByStatus(projectId, memberId, sortDirection, reviewStatus, pageParam as number | undefined, 10);
    },
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
