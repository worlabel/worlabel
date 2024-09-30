import { useState, useEffect } from 'react';
import TrainingSettings from './TrainingSettings';
import TrainingGraph from './TrainingGraph';
import useTrainModelQuery from '@/queries/models/useTrainModelQuery';
import { ModelTrainRequest, ModelResponse } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

interface TrainingTabProps {
  projectId: number | null;
}

export default function TrainingTab({ projectId }: TrainingTabProps) {
  const numericProjectId = projectId !== null ? Number(projectId) : null;
  const [selectedModel, setSelectedModel] = useState<ModelResponse | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: startTraining } = useTrainModelQuery(numericProjectId as number, {
    onError: () => {
      alert('학습 요청 실패');
      setIsPolling(false);
    },
  });

  const handleTrainingStart = (trainData: ModelTrainRequest) => {
    if (numericProjectId !== null) {
      startTraining(trainData);
      setIsPolling(true);
    }
  };

  useEffect(() => {
    if (!selectedModel || !numericProjectId || !isPolling) return;

    const intervalId = setInterval(async () => {
      await queryClient.invalidateQueries({ queryKey: ['projectModels', numericProjectId] });

      const models = await queryClient.getQueryData<ModelResponse[]>(['projectModels', numericProjectId]);

      const updatedModel = models?.find((model) => model.id === selectedModel.id);

      if (updatedModel) {
        setSelectedModel(updatedModel);

        if (updatedModel.isTrain) {
          setIsPolling(true);
        } else if (!updatedModel.isTrain && selectedModel.isTrain) {
          setIsPolling(false);
          setSelectedModel(null);
        }
      }
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedModel, numericProjectId, queryClient, isPolling]);

  const handleTrainingStop = () => {
    setIsPolling(false);
  };

  return (
    <div className="grid grid-rows-[auto_1fr] gap-8 md:grid-cols-2">
      <TrainingSettings
        key={`${selectedModel?.isTrain ? 'training' : 'settings'}-${isPolling}`}
        projectId={numericProjectId}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        handleTrainingStart={handleTrainingStart}
        handleTrainingStop={handleTrainingStop}
        isPolling={isPolling}
        className="h-full"
      />
      <TrainingGraph
        key={`${selectedModel?.isTrain ? 'training' : 'graph'}-${isPolling}`}
        projectId={numericProjectId}
        selectedModel={selectedModel}
        className="h-full"
      />
    </div>
  );
}
