import { getReviewDetail } from '@/api/reviewApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useReviewDetailQuery(projectId: number, reviewId: number, memberId: number) {
  return useSuspenseQuery({
    queryKey: ['reviewDetail', projectId, reviewId, memberId],
    queryFn: () => getReviewDetail(projectId, reviewId, memberId),
  });
}
