import useTrainModelQuery from '@/queries/models/useTrainModelQuery';
import useModelStore from '@/stores/useModelStore';
import TrainingSettings from './TrainingSettings';
import TrainingGraph from './TrainingGraph';
import { ModelTrainRequest } from '@/types';

interface TrainingTabProps {
  projectId: number | null;
}
//Todo : 로직 수정, isTrain을 서버 단에서 받고, 셀렉트 됐을 때 개별 조회로 isTrain을 판단해서, 학습 중이면 리패치하는 방식으로 관리한다.
export default function TrainingTab({ projectId }: TrainingTabProps) {
  const numericProjectId = projectId ? parseInt(projectId.toString(), 10) : null;
  const { isTrainingByProject, setIsTraining, selectedModelByProject, setSelectedModel, resetTrainingData } =
    useModelStore((state) => ({
      isTrainingByProject: state.isTrainingByProject,
      setIsTraining: state.setIsTraining,
      selectedModelByProject: state.selectedModelByProject,
      setSelectedModel: state.selectModel,
      resetTrainingData: state.resetTrainingData,
    }));

  const projectKey = numericProjectId?.toString() || '';
  const isTraining = isTrainingByProject[projectKey] || false;
  const selectedModel = selectedModelByProject[projectKey];

  const { mutate: startTraining } = useTrainModelQuery(numericProjectId as number);

  const handleTrainingStart = (trainData: ModelTrainRequest) => {
    if (!isTraining && selectedModel !== null) {
      setIsTraining(projectKey, true);
      startTraining(trainData);
    }
  };

  const handleTrainingStop = () => {
    if (isTraining) {
      setIsTraining(projectKey, false);
      resetTrainingData(projectKey);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr] gap-8 md:grid-cols-2">
      <TrainingSettings
        projectId={numericProjectId}
        selectedModel={selectedModel}
        setSelectedModel={(modelId) => setSelectedModel(projectKey, modelId)}
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
