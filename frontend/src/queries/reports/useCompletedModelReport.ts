import { useSuspenseQuery } from '@tanstack/react-query';
import { getCompletedModelReport } from '@/api/reportApi';
import { ReportResponse } from '@/types';

export default function useCompletedModelReport(projectId: number, modelId: number) {
  return useSuspenseQuery<ReportResponse[]>({
    queryKey: ['modelReport', projectId, modelId],
    queryFn: () => getCompletedModelReport(projectId, modelId),
  });
}
