import { saveImageLabels } from '@/api/lablingApi';
import { useMutation } from '@tanstack/react-query';

export default function useSaveImageLabelsQuery() {
  return useMutation({
    mutationFn: ({ projectId, imageId, data }: { projectId: number; imageId: number; data: { data: string } }) =>
      saveImageLabels(projectId, imageId, data),
  });
}
