import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview } from '@/api/reviewApi';
import { ReviewRequest } from '@/types';

export default function useCreateReviewQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      memberId,
      reviewData,
    }: {
      projectId: number;
      memberId: number;
      reviewData: ReviewRequest;
    }) => createReview(projectId, memberId, reviewData),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviewDetail', variables.projectId] });
    },
  });
}
