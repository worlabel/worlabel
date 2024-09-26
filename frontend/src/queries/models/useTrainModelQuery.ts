import { useMutation } from '@tanstack/react-query';
import { trainModel } from '@/api/modelApi';
import { ModelTrainRequest } from '@/types';

export default function useTrainModelQuery(projectId: number) {
  return useMutation({
    mutationFn: (trainData: ModelTrainRequest) => trainModel(projectId, trainData),
  });
}
