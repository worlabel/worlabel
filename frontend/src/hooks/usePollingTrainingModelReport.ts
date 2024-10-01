import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrainingModelReport } from '@/api/reportApi';
import { ReportResponse } from '@/types';

interface UsePollingTrainingModelReportProps {
  projectId: number;
  modelId: number;
  enabled: boolean;
  onTrainingEnd: () => void;
}

export default function usePollingTrainingModelReport({
  projectId,
  modelId,
  enabled,
  onTrainingEnd,
}: UsePollingTrainingModelReportProps) {
  const query = useQuery<ReportResponse[]>({
    queryKey: ['modelReports', projectId, modelId],
    queryFn: () => getTrainingModelReport(projectId, modelId),
    enabled,
    refetchInterval: (data) => {
      if (!enabled) return false;
      if (Array.isArray(data)) {
        const lastReport = data[data.length - 1];
        return lastReport?.epochTime ? Math.max(2000, lastReport.epochTime / 2) : 2000;
      }
      return 2000;
    },
  });

  useEffect(() => {
    if (query.data && query.data.length > 0) {
      const lastReport = query.data[query.data.length - 1];
      if (lastReport.epoch >= lastReport.totalEpochs) {
        onTrainingEnd();
      }
    }
  }, [query.data, onTrainingEnd]);

  return query;
}
