import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReviewStatus } from '@/api/reviewApi';

export default function useUpdateReviewStatusQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      reviewId,
      memberId,
      reviewStatus,
    }: {
      projectId: number;
      reviewId: number;
      memberId: number;
      reviewStatus: string;
    }) => updateReviewStatus(projectId, reviewId, memberId, reviewStatus),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviewDetail', variables.projectId, variables.reviewId] });
    },
  });
}
