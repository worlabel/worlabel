import { getWorkspaceReviews } from '@/api/workspaceApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useWorkspaceReviewsQuery(
  workspaceId: number,
  memberId: number,
  reviewStatus?: 'REQUESTED' | 'APPROVED' | 'REJECTED',
  lastReviewId?: number,
  limitPage?: number
) {
  return useSuspenseQuery({
    queryKey: ['workspaceReviews', workspaceId, reviewStatus, lastReviewId],
    queryFn: () => getWorkspaceReviews(workspaceId, memberId, reviewStatus, lastReviewId, limitPage),
  });
}
