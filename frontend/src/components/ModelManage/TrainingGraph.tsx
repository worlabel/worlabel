import { useEffect, useState } from 'react';
import ModelLineChart from './ModelLineChart';
import usePollingModelReportsQuery from '@/queries/reports/usePollingModelReportsQuery';
import { ModelResponse } from '@/types';

interface TrainingGraphProps {
  projectId: number | null;
  selectedModel: ModelResponse | null;
  className?: string;
}

export default function TrainingGraph({ projectId, selectedModel, className }: TrainingGraphProps) {
  const [isPolling, setIsPolling] = useState(false);
  const { data: trainingDataList } = usePollingModelReportsQuery(
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

  return (
    <ModelLineChart
      data={trainingDataList || []}
      className={className}
    />
  );
}
