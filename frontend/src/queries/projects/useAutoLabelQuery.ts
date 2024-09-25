import { runAutoLabel } from '@/api/lablingApi';
import { useMutation } from '@tanstack/react-query';

export default function useAutoLabelQuery() {
  return useMutation({
    mutationFn: ({ projectId, modelId = 1 }: { projectId: number; modelId?: number }) =>
      runAutoLabel(projectId, modelId),
  });
}
