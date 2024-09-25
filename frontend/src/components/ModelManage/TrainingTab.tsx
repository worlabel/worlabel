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
  const { isTrainingByProject, setIsTraining, selectedModelByProject, setSelectedModel, resetTrainingData } =
    useModelStore((state) => ({
      isTrainingByProject: state.isTrainingByProject,
      setIsTraining: state.setIsTraining,
      selectedModelByProject: state.selectedModelByProject,
      setSelectedModel: state.setSelectedModel,
      resetTrainingData: state.resetTrainingData,
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

  const handleTrainingStop = () => {
    if (isTraining) {
      setIsTraining(numericProjectId?.toString() || '', false);
      resetTrainingData(numericProjectId?.toString() || '');
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr] gap-8 md:grid-cols-2">
      <TrainingSettings
        projectId={numericProjectId}
        selectedModel={selectedModel}
        setSelectedModel={(modelId) => setSelectedModel(numericProjectId?.toString() || '', modelId)}
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
