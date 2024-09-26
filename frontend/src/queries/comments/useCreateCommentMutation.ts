import { createComment } from '@/api/commentAPi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentResponse } from '@/types';

export default function useCreateCommentMutation(projectId: number, imageId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentData: CommentResponse) => createComment(projectId, imageId, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentList', projectId, imageId] });
    },
  });
}
