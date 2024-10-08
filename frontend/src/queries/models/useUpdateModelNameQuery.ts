import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateModelName } from '@/api/modelApi';
import { ModelRequest } from '@/types';

export default function useUpdateModelNameQuery(projectId: number, modelId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (modelData: ModelRequest) => updateModelName(projectId, modelId, modelData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectModels', projectId] });
    },
  });
}
