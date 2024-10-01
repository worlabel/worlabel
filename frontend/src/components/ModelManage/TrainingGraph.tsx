import { useEffect } from 'react';
import ModelLineChart from './ModelLineChart';
import usePollingTrainingModelReport from '@/hooks/usePollingTrainingModelReport';
import { useQueryClient } from '@tanstack/react-query';
import { ModelResponse } from '@/types';

interface TrainingGraphProps {
  projectId: number | null;
  selectedModel: ModelResponse | null;
  className?: string;
}

export default function TrainingGraph({ projectId, selectedModel, className }: TrainingGraphProps) {
  const queryClient = useQueryClient();

  const isTrainingEnabled = Boolean(selectedModel?.isTrain);

  const handleTrainingEnd = () => {
    queryClient.resetQueries({
      queryKey: ['modelReports', projectId, selectedModel?.id],
      exact: true,
    });
    alert('학습이 완료되었습니다.');
  };

  const { data: trainingDataList } = usePollingTrainingModelReport({
    projectId: projectId as number,
    modelId: selectedModel?.id as number,
    enabled: isTrainingEnabled,
    onTrainingEnd: handleTrainingEnd,
  });

  useEffect(() => {
    if (!selectedModel || !selectedModel.isTrain) {
      queryClient.resetQueries({
        queryKey: ['modelReports', projectId, selectedModel?.id],
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
