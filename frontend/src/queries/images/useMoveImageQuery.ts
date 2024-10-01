import { useMutation, useQueryClient } from '@tanstack/react-query';
import { moveImage } from '@/api/imageApi';
import { ImageMoveRequest } from '@/types';

interface MoveImageMutationVariables {
  imageId: number;
  memberId: number;
  moveRequest: ImageMoveRequest;
}

export default function useMoveImageQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId, memberId, moveRequest }: MoveImageMutationVariables) =>
      moveImage(imageId, memberId, moveRequest),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['image', variables.imageId] });
    },
  });
}
