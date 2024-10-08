import { useQuery } from '@tanstack/react-query';
import { getTrainingModelReport } from '@/api/reportApi';
import { ReportResponse } from '@/types';

interface UseTrainingModelReportQueryProps {
  projectId: number;
  modelId: number;
  enabled?: boolean;
  refetchInterval?: number | false;
}

export default function useTrainingModelReportQuery({
  projectId,
  modelId,
  enabled = true,
  refetchInterval = false,
}: UseTrainingModelReportQueryProps) {
  return useQuery<ReportResponse[]>({
    queryKey: ['modelReports', projectId, modelId],
    queryFn: () => getTrainingModelReport(projectId, modelId),
    enabled,
    refetchInterval,
  });
}
