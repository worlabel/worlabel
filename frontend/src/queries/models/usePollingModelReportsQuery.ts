import { useQuery } from '@tanstack/react-query';
import { getModelReports } from '@/api/modelApi';
import { ReportResponse } from '@/types';

export default function usePollingModelReportsQuery(projectId: number, modelId: number, enabled: boolean) {
  return useQuery<ReportResponse[]>({
    queryKey: ['pollingModelReports', projectId, modelId],
    queryFn: () => getModelReports(projectId, modelId),
    refetchInterval: 5000,
    enabled,
  });
}
