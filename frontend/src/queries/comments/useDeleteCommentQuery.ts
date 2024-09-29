import { deleteComment } from '@/api/commentAPi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useDeleteCommentQuery(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(projectId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentList', projectId] });
    },
  });
}
