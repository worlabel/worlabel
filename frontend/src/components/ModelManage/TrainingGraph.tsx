import { useMemo } from 'react';
import ModelLineChart from './ModelLineChart';
import usePollingTrainingModelReport from '@/queries/reports/usePollingModelReportsQuery';
import { ModelResponse } from '@/types';

interface TrainingGraphProps {
  projectId: number | null;
  selectedModel: ModelResponse | null;
  className?: string;
}

export default function TrainingGraph({ projectId, selectedModel, className }: TrainingGraphProps) {
  const isTraining = selectedModel?.isTrain || false;

  const { data: fetchedTrainingDataList } = usePollingTrainingModelReport(
    projectId as number,
    selectedModel?.id as number,
    isTraining
  );

  const trainingDataList = useMemo(() => {
    if (!isTraining) {
      return [];
    }
    return fetchedTrainingDataList || [];
  }, [isTraining, fetchedTrainingDataList]);

  return (
    <ModelLineChart
      data={trainingDataList}
      className={className}
    />
  );
}
