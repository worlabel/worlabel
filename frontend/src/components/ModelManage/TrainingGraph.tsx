import { useEffect } from 'react';
import ModelLineChart from './ModelLineChart';
import usePollingTrainingModelReport from '@/queries/reports/usePollingModelReportsQuery';
import { useQueryClient } from '@tanstack/react-query';
import { ModelResponse } from '@/types';

interface TrainingGraphProps {
  projectId: number | null;
  selectedModel: ModelResponse | null;
  className?: string;
}

export default function TrainingGraph({ projectId, selectedModel, className }: TrainingGraphProps) {
  const queryClient = useQueryClient();

  const { data: trainingDataList } = usePollingTrainingModelReport(
    projectId as number,
    selectedModel?.id as number,
    selectedModel?.isTrain || false
  );

  useEffect(() => {
    if (!selectedModel || !selectedModel.isTrain) {
      queryClient.resetQueries({
        queryKey: [{ type: 'modelReports', projectId, modelId: selectedModel?.id }],
        exact: true,
      });
    }
  }, [selectedModel, queryClient, projectId]);

  return (
    <ModelLineChart
      data={trainingDataList || []}
      className={className}
    />
  );
}
