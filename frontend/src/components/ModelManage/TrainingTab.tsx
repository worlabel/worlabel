import { useState, useEffect, useRef } from 'react';
import TrainingSettings from './TrainingSettings';
import TrainingGraph from './TrainingGraph';
import useTrainModelQuery from '@/queries/models/useTrainModelQuery';
import useProjectModelsQuery from '@/queries/models/useProjectModelsQuery';
import { ModelTrainRequest, ModelResponse } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

interface TrainingTabProps {
  projectId: number | null;
}

export default function TrainingTab({ projectId }: TrainingTabProps) {
  const numericProjectId = projectId !== null ? Number(projectId) : null;
  const [selectedModel, setSelectedModel] = useState<ModelResponse | null>(null);
  const [isWaiting, setIsWaiting] = useState<{ [modelId: number]: boolean }>({});
  const [isTraining, setIsTraining] = useState<{ [modelId: number]: boolean }>({});
  const queryClient = useQueryClient();
  const prevModelRef = useRef<ModelResponse | null>(null);

  const { mutate: startTraining } = useTrainModelQuery(numericProjectId as number);
  const { data: models } = useProjectModelsQuery(numericProjectId ?? 0);

  useEffect(() => {
    if (models) {
      const trainingModels = models.filter((model) => model.isTrain);
      const newIsTraining = trainingModels.reduce(
        (acc, model) => {
          acc[model.id] = true;
          return acc;
        },
        {} as { [modelId: number]: boolean }
      );
      setIsTraining(newIsTraining);

      if (trainingModels.length > 0) {
        setSelectedModel(trainingModels[0]);
      } else {
        setSelectedModel(null);
      }
    }
  }, [models]);

  useEffect(() => {
    if (models && selectedModel) {
      const updatedModel = models.find((model) => model.id === selectedModel.id);
      if (updatedModel) {
        setSelectedModel(updatedModel);

        if (isWaiting[selectedModel.id] && updatedModel.isTrain) {
          setIsWaiting((prev) => ({ ...prev, [selectedModel.id]: false }));
          setIsTraining((prev) => ({ ...prev, [selectedModel.id]: true }));
        }
      }
    }
  }, [models, selectedModel, isWaiting]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (selectedModel && isWaiting[selectedModel.id]) {
      intervalId = setInterval(async () => {
        await queryClient.invalidateQueries({ queryKey: ['projectModels', numericProjectId] });
      }, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isWaiting, selectedModel, queryClient, numericProjectId]);

  const handleTrainingStart = (trainData: ModelTrainRequest) => {
    if (numericProjectId !== null && selectedModel) {
      startTraining(trainData);
      setIsWaiting((prev) => ({ ...prev, [selectedModel.id]: true }));
    }
  };

  const handleTrainingEnd = (modelId: number) => {
    if (prevModelRef.current && prevModelRef.current.id === modelId) {
      Swal.fire({
        title: '학습 완료',
        text: `모델 "${prevModelRef.current.name}"의 학습이 완료되었습니다.`,
        icon: 'success',
        confirmButtonText: '확인',
      });
    }

    setIsTraining((prev) => ({ ...prev, [modelId]: false }));

    if (selectedModel && selectedModel.id === modelId) {
      setSelectedModel(null);
    }
  };

  const handleTrainingStop = () => {
    if (selectedModel) {
      setIsWaiting((prev) => ({ ...prev, [selectedModel.id]: false }));
      setIsTraining((prev) => ({ ...prev, [selectedModel.id]: false }));
      setSelectedModel(null);
      // TODO: 학습 중단 기능 구현
    }
  };

  useEffect(() => {
    if (selectedModel) {
      prevModelRef.current = selectedModel;
    }
  }, [selectedModel]);

  return (
    <div className="grid grid-rows-[auto_1fr] gap-8 md:grid-cols-2">
      <TrainingSettings
        projectId={numericProjectId}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        handleTrainingStart={handleTrainingStart}
        handleTrainingStop={handleTrainingStop}
        isWaiting={selectedModel ? isWaiting[selectedModel.id] || false : false}
        isTraining={selectedModel ? isTraining[selectedModel.id] || false : false}
        className="h-full"
      />
      <TrainingGraph
        projectId={numericProjectId}
        selectedModel={selectedModel}
        isTraining={selectedModel ? isTraining[selectedModel.id] || false : false}
        onTrainingEnd={() => selectedModel && handleTrainingEnd(selectedModel.id)}
        className="h-full"
      />
    </div>
  );
}
