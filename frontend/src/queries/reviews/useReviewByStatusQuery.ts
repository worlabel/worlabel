import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getReviewByStatus } from '@/api/reviewApi';
import { ReviewResponse, ReviewStatus } from '@/types';

export default function useReviewByStatusQuery(
  projectId: number,
  memberId: number,
  reviewStatus: ReviewStatus | undefined,
  sortDirection: number
) {
  return useSuspenseInfiniteQuery<ReviewResponse[]>({
    queryKey: ['reviewByStatus', projectId, memberId, reviewStatus, sortDirection],
    queryFn: ({ pageParam = undefined }) =>
      getReviewByStatus(projectId, memberId, sortDirection, reviewStatus, pageParam as number | undefined, 10),
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
