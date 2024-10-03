import { useMutation, useQueryClient } from '@tanstack/react-query';
import { moveImage } from '@/api/imageApi';
import { ImageMoveRequest } from '@/types';

interface MoveImageMutationVariables {
  projectId: number;
  folderId: number;
  imageId: number;
  moveRequest: ImageMoveRequest;
}

export default function useMoveImageQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, folderId, imageId, moveRequest }: MoveImageMutationVariables) =>
      moveImage(projectId, folderId, imageId, moveRequest),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['image', variables.imageId] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['folder', variables.folderId] });
    },
  });
}
