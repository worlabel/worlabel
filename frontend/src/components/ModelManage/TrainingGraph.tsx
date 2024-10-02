import ModelLineChart from './ModelLineChart';
import usePollingTrainingModelReport from '@/hooks/usePollingTrainingModelReport';
import { ModelResponse } from '@/types';

interface TrainingGraphProps {
  projectId: number | null;
  selectedModel: ModelResponse | null;
  isTraining: boolean;
  onTrainingEnd: () => void;
  className?: string;
}

export default function TrainingGraph({
  projectId,
  selectedModel,
  isTraining,
  onTrainingEnd,
  className,
}: TrainingGraphProps) {
  const { reportData: trainingDataList } = usePollingTrainingModelReport({
    projectId: projectId as number,
    modelId: selectedModel?.id as number,
    enabled: isTraining,
    onTrainingEnd,
  });

  return (
    <ModelLineChart
      data={trainingDataList || []}
      className={className}
    />
  );
}
