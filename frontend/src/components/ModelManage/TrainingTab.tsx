import useTrainModelQuery from '@/queries/models/useTrainModelQuery';
import useModelStore from '@/stores/useModelStore';
import TrainingSettings from './TrainingSettings';
import TrainingGraph from './TrainingGraph';
import { ModelTrainRequest } from '@/types';

interface TrainingTabProps {
  projectId: number | null;
}

export default function TrainingTab({ projectId }: TrainingTabProps) {
  const numericProjectId = projectId ? parseInt(projectId.toString(), 10) : null;
  const { isTrainingByProject, setIsTraining, selectedModelByProject, setSelectedModel, trainingDataByProject } =
    useModelStore((state) => ({
      isTrainingByProject: state.isTrainingByProject,
      setIsTraining: state.setIsTraining,
      selectedModelByProject: state.selectedModelByProject,
      setSelectedModel: state.setSelectedModel,
      trainingDataByProject: state.trainingDataByProject,
    }));

  const isTraining = isTrainingByProject[numericProjectId?.toString() || ''] || false;
  const selectedModel = selectedModelByProject[numericProjectId?.toString() || ''];

  const { mutate: startTraining } = useTrainModelQuery(numericProjectId as number);

  const handleTrainingStart = (trainData: ModelTrainRequest) => {
    if (!isTraining && selectedModel !== null) {
      setIsTraining(numericProjectId?.toString() || '', true);
      startTraining(trainData);
    }
  };

  const trainingData = trainingDataByProject[numericProjectId?.toString() || ''];

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <TrainingSettings
        projectId={numericProjectId}
        selectedModel={selectedModel}
        setSelectedModel={(modelId) => setSelectedModel(numericProjectId?.toString() || '', modelId)}
        handleTrainingStart={handleTrainingStart}
        isTraining={isTraining}
      />

      <TrainingGraph
        projectId={numericProjectId}
        selectedModel={selectedModel}
      />

      {trainingData && (
        <div className="mt-4">
          <p>현재 에포크: {trainingData[trainingData.length - 1]?.epoch}</p>
          <p>총 에포크: {trainingData[trainingData.length - 1]?.totalEpochs}</p>
          <p>예상 남은시간: {trainingData[trainingData.length - 1]?.leftSecond}</p>
        </div>
      )}
    </div>
  );
}
