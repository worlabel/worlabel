import { useMutation } from '@tanstack/react-query';
import { trainModel } from '@/api/modelApi';

export default function useTrainModelQuery(projectId: number) {
  return useMutation({
    mutationFn: () => trainModel(projectId),
  });
}
