import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrainingModelReport } from '@/api/reportApi';
import { getProjectModels } from '@/api/modelApi';
import { ReportResponse, ProjectModelsResponse } from '@/types';

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
  const reportQuery = useQuery<ReportResponse[]>({
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

  const modelQuery = useQuery<ProjectModelsResponse>({
    queryKey: ['projectModels', projectId],
    queryFn: () => getProjectModels(projectId),
    enabled,
    refetchInterval: 2000,
  });

  const prevIsTrainRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (modelQuery.data) {
      const model = modelQuery.data.find((m) => m.id === modelId);
      if (model) {
        const currentIsTrain = model.isTrain;
        const prevIsTrain = prevIsTrainRef.current;

        if (prevIsTrain === true && currentIsTrain === false) {
          onTrainingEnd();
        }

        prevIsTrainRef.current = currentIsTrain;
      }
    }
  }, [modelQuery.data, modelId, onTrainingEnd]);

  return { reportData: reportQuery.data, modelData: modelQuery.data };
}
