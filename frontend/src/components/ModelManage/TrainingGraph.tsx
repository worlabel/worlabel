import { useEffect, useState } from 'react';
import ModelLineChart from './ModelLineChart';
import usePollingTrainingModelReport from '@/queries/reports/usePollingModelReportsQuery';
import { ModelResponse } from '@/types';
import { Spinner } from '@/components/ui/spinner';

interface TrainingGraphProps {
  projectId: number | null;
  selectedModel: ModelResponse | null;
  className?: string;
}

export default function TrainingGraph({ projectId, selectedModel, className }: TrainingGraphProps) {
  const [isPolling, setIsPolling] = useState(false);
  const { data: trainingDataList, isLoading } = usePollingTrainingModelReport(
    projectId as number,
    selectedModel?.id as number,
    isPolling
  );

  useEffect(() => {
    if (selectedModel) {
      setIsPolling(true);
    } else {
      setIsPolling(false);
    }
  }, [selectedModel]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Spinner />
        데이터 로딩 중...
      </div>
    );
  }

  return (
    <ModelLineChart
      data={trainingDataList || []}
      className={className}
    />
  );
}
