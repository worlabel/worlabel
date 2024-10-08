import { useMutation } from '@tanstack/react-query';
import { deleteImage } from '@/api/imageApi';

interface DeleteImageMutationVariables {
  projectId: number;
  folderId: number;
  imageId: number;
}

export default function useDeleteImageQuery() {
  return useMutation({
    mutationFn: ({ projectId, folderId, imageId }: DeleteImageMutationVariables) =>
      deleteImage(projectId, folderId, imageId),
  });
}
