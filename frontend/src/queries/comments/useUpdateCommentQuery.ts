import { updateComment } from '@/api/commentAPi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentRequest } from '@/types';

export default function useUpdateCommentQuery(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, commentData }: { commentId: number; commentData: CommentRequest }) =>
      updateComment(projectId, commentId, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentList', projectId] });
    },
  });
}
