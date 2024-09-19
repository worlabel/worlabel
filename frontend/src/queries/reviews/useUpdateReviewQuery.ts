import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReview } from '@/api/reviewApi';
import { ReviewRequest } from '@/types';

export default function useUpdateReviewQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      reviewId,
      memberId,
      reviewData,
    }: {
      projectId: number;
      reviewId: number;
      memberId: number;
      reviewData: ReviewRequest;
    }) => updateReview(projectId, reviewId, memberId, reviewData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviewDetail', variables.projectId, variables.reviewId] });
    },
  });
}
