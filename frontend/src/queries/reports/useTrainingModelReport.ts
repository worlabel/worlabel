import { useSuspenseQuery } from '@tanstack/react-query';
import { getTrainingModelReport } from '@/api/reportApi';
import { ReportResponse } from '@/types';

export default function useTrainingModelReport(projectId: number, modelId: number) {
  return useSuspenseQuery<ReportResponse[]>({
    queryKey: ['modelReports', projectId, modelId],
    queryFn: () => getTrainingModelReport(projectId, modelId),
  });
}
