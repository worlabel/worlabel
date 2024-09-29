import { useState } from 'react';
import TrainingSettings from './TrainingSettings';
import TrainingGraph from './TrainingGraph';
import useTrainModelQuery from '@/queries/models/useTrainModelQuery';
import { ModelTrainRequest, ModelResponse } from '@/types';

interface TrainingTabProps {
  projectId: number | null;
}

export default function TrainingTab({ projectId }: TrainingTabProps) {
  const numericProjectId = projectId !== null ? Number(projectId) : null;
  const [selectedModel, setSelectedModel] = useState<ModelResponse | null>(null);

  const { mutate: startTraining } = useTrainModelQuery(numericProjectId as number);

  const handleTrainingStart = (trainData: ModelTrainRequest) => {
    startTraining(trainData);
  };

  const handleTrainingStop = () => {
    // Todo: 학습 중단 로직
  };

  return (
    <div className="grid grid-rows-[auto_1fr] gap-8 md:grid-cols-2">
      <TrainingSettings
        projectId={numericProjectId}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        handleTrainingStart={handleTrainingStart}
        handleTrainingStop={handleTrainingStop}
        className="h-full"
      />

      <TrainingGraph
        projectId={numericProjectId}
        selectedModel={selectedModel}
        className="h-full"
      />
    </div>
  );
}
