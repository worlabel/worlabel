import { createComment } from '@/api/commentAPi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentRequest } from '@/types';

export default function useCreateCommentQuery(projectId: number, imageId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentData: CommentRequest) => createComment(projectId, imageId, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentList', projectId, imageId] });
    },
  });
}
