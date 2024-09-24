import { useSuspenseQuery } from '@tanstack/react-query';
import { getModelReports } from '@/api/modelApi';
import { ReportResponse } from '@/types';

export default function useModelReportsQuery(projectId: number, modelId: number) {
  return useSuspenseQuery<ReportResponse[]>({
    queryKey: ['modelReports', projectId, modelId],
    queryFn: () => getModelReports(projectId, modelId),
  });
}
