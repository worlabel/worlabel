import { useMutation } from '@tanstack/react-query';
import { trainModel } from '@/api/modelApi';
import { ModelTrainRequest } from '@/types';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

interface UseTrainModelOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export default function useTrainModelQuery(projectId: number, options?: UseTrainModelOptions) {
  return useMutation({
    mutationFn: (trainData: ModelTrainRequest) => trainModel(projectId, trainData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectModels', projectId] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
