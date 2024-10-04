import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectReview } from '@/api/reviewApi';

interface ReviewStatusChangeProps {
  projectId: number;
  reviewId: number;
  memberId: number;
}

export default function useRejectReviewQuery({ projectId, reviewId, memberId }: ReviewStatusChangeProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => rejectReview(projectId, reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewDetail', projectId, reviewId, memberId] });
      queryClient.invalidateQueries({ queryKey: ['reviewByStatus', projectId, reviewId, memberId] });
    },
  });
}
