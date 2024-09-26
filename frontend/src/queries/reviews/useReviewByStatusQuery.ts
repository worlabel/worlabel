import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getReviewByStatus } from '@/api/reviewApi';
import { ReviewResponse } from '@/types';

export default function useReviewByStatusQuery(
  projectId: number,
  memberId: number,
  reviewStatus: 'REQUESTED' | 'APPROVED' | 'REJECTED' | undefined
) {
  return useSuspenseInfiniteQuery<ReviewResponse[]>({
    queryKey: ['reviewByStatus', projectId, reviewStatus],
    queryFn: ({ pageParam = undefined }) => {
      return getReviewByStatus(projectId, memberId, reviewStatus, pageParam as number | undefined);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined;
      const lastReview = lastPage[lastPage.length - 1];
      return lastReview.reviewId;
    },
    initialPageParam: undefined,
  });
}
