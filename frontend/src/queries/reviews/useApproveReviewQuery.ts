import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveReview } from '@/api/reviewApi';

interface ReviewStatusChangeProps {
  projectId: number;
  reviewId: number;
  memberId: number;
}

export default function useApproveReviewQuery({ projectId, reviewId, memberId }: ReviewStatusChangeProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => approveReview(projectId, reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewDetail', projectId, reviewId, memberId] });
    },
  });
}
