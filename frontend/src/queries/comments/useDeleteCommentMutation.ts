import { deleteComment } from '@/api/commentAPi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useDeleteCommentMutation(projectId: number, commentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteComment(projectId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentList', projectId] });
    },
  });
}
