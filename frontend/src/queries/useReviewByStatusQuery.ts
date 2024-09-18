import { getReviewByStatus } from '@/api/reviewApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useReviewByStatusQuery(projectId: number, memberId: number, reviewStatus: string) {
  return useSuspenseQuery({
    queryKey: ['reviewByStatus', projectId, reviewStatus],
    queryFn: () => getReviewByStatus(projectId, memberId, reviewStatus),
  });
}
