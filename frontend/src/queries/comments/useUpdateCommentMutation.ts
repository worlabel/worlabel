import { updateComment } from '@/api/commentAPi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentResponse } from '@/types';

export default function useUpdateCommentMutation(projectId: number, commentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentData: CommentResponse) => updateComment(projectId, commentId, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment', projectId, commentId] });
      queryClient.invalidateQueries({ queryKey: ['commentList', projectId] });
    },
  });
}
