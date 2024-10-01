import { useState, useEffect } from 'react';
import TrainingSettings from './TrainingSettings';
import TrainingGraph from './TrainingGraph';
import useTrainModelQuery from '@/queries/models/useTrainModelQuery';
import usePollingTrainingModelReport from '@/hooks/usePollingTrainingModelReport';
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

  const { mutate: startTraining } = useTrainModelQuery(numericProjectId as number);

  const handleTrainingStart = (trainData: ModelTrainRequest) => {
    if (numericProjectId !== null) {
      startTraining(trainData);
      setIsPolling(true);
    }
  };

  const handleTrainingEnd = () => {
    setIsPolling(false);
    setSelectedModel((prevModel) => (prevModel ? { ...prevModel, isTrain: false } : null));
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
          setIsPolling(false);
        } else {
          setIsPolling(false);
          setSelectedModel({ ...updatedModel, isTrain: false });
        }
      }
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedModel, numericProjectId, queryClient, isPolling]);

  usePollingTrainingModelReport({
    projectId: numericProjectId as number,
    modelId: selectedModel?.id as number,
    enabled: selectedModel?.isTrain || false,
    onTrainingEnd: handleTrainingEnd,
  });

  const handleTrainingStop = () => {
    setIsPolling(false);
    setSelectedModel((prevModel) => (prevModel ? { ...prevModel, isTrain: false } : null));
    //todo: 중단 함수 연결
  };

  return (
    <div className="grid grid-rows-[auto_1fr] gap-8 md:grid-cols-2">
      <TrainingSettings
        projectId={numericProjectId}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        handleTrainingStart={handleTrainingStart}
        handleTrainingStop={handleTrainingStop}
        isPolling={isPolling}
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
