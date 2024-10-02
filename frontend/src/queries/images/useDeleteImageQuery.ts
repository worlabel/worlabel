import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteImage } from '@/api/imageApi';

interface DeleteImageMutationVariables {
  imageId: number;
  memberId: number;
}

export default function useDeleteImageQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId, memberId }: DeleteImageMutationVariables) => deleteImage(imageId, memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['image', variables.imageId] });
    },
  });
}
