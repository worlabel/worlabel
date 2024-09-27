import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectReview } from '@/api/reviewApi';

interface ReviewStatusChangeProps {
  projectId: number;
  reviewId: number;
}

export default function useRejectReviewQuery({ projectId, reviewId }: ReviewStatusChangeProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => rejectReview(projectId, reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewDetail', reviewId] });
    },
  });
}
