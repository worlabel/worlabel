import { useMutation } from '@tanstack/react-query';
import { trainModel } from '@/api/modelApi';
import { ModelTrainRequest } from '@/types';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function useTrainModelQuery(projectId: number) {
  return useMutation({
    mutationFn: (trainData: ModelTrainRequest) => trainModel(projectId, trainData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectModels', projectId] });
    },
  });
}
