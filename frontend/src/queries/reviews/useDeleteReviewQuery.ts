import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReview } from '@/api/reviewApi';

export default function useDeleteReviewQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, reviewId, memberId }: { projectId: number; reviewId: number; memberId: number }) =>
      deleteReview(projectId, reviewId, memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviewDetail', variables.projectId, variables.reviewId] });
    },
  });
}
