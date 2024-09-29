import { useQuery } from '@tanstack/react-query';
import { getTrainingModelReport } from '@/api/reportApi';
import { ReportResponse } from '@/types';

export default function usePollingTrainingModelReport(projectId: number, modelId: number, enabled: boolean) {
  return useQuery<ReportResponse[]>({
    queryKey: ['modelReports', projectId, modelId],
    queryFn: () => getTrainingModelReport(projectId, modelId),
    refetchInterval: enabled ? 5000 : false,
    enabled,
  });
}
