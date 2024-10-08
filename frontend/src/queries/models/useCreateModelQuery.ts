import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addProjectModel } from '@/api/modelApi';
import { ModelRequest } from '@/types';

export default function useCreateModelQuery(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (modelData: ModelRequest) => addProjectModel(projectId, modelData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectModels', projectId] });
    },
  });
}
