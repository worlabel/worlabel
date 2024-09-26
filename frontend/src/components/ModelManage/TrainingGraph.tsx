import { useEffect, useMemo } from 'react';
import ModelLineChart from './ModelLineChart';
import usePollingModelReportsQuery from '@/queries/models/usePollingModelReportsQuery';
import useModelStore from '@/stores/useModelStore';

interface TrainingGraphProps {
  projectId: number | null;
  selectedModel: number | null;
  className?: string;
}

export default function TrainingGraph({ projectId, selectedModel, className }: TrainingGraphProps) {
  const projectKey = projectId?.toString() || '';

  const {
    isTrainingByProject,
    isTrainingCompleteByProject,
    setIsTraining,
    setIsTrainingComplete,
    saveTrainingData,
    resetTrainingData,
    trainingDataByProject,
    selectModel,
  } = useModelStore((state) => ({
    isTrainingByProject: state.isTrainingByProject,
    isTrainingCompleteByProject: state.isTrainingCompleteByProject,
    setIsTraining: state.setIsTraining,
    setIsTrainingComplete: state.setIsTrainingComplete,
    saveTrainingData: state.saveTrainingData,
    resetTrainingData: state.resetTrainingData,
    trainingDataByProject: state.trainingDataByProject,
    selectModel: state.selectModel,
  }));

  const isTraining = isTrainingByProject[projectKey] || false;
  const isTrainingComplete = isTrainingCompleteByProject[projectKey] || false;

  useEffect(() => {
    if (projectId !== null) {
      selectModel(projectKey, selectedModel);
    }
  }, [selectedModel, projectId, projectKey, selectModel]);

  const { data: fetchedTrainingDataList } = usePollingModelReportsQuery(
    projectId as number,
    selectedModel as number,
    isTraining && !!projectId && !!selectedModel
  );

  const trainingDataList = useMemo(() => {
    if (!isTraining) {
      return [];
    }
    return trainingDataByProject[projectKey] || fetchedTrainingDataList || [];
  }, [isTraining, projectKey, trainingDataByProject, fetchedTrainingDataList]);

  useEffect(() => {
    if (fetchedTrainingDataList) {
      saveTrainingData(projectKey, fetchedTrainingDataList);
    }
  }, [fetchedTrainingDataList, projectKey, saveTrainingData]);

  useEffect(() => {
    if (isTraining && trainingDataList.length > 0) {
      const latestData = trainingDataList[trainingDataList.length - 1];
      if (latestData.epoch === latestData.totalEpochs && latestData.totalEpochs > 0) {
        setIsTrainingComplete(projectKey, true);
      } else {
        setIsTrainingComplete(projectKey, false);
      }
    }
  }, [trainingDataList, setIsTrainingComplete, projectKey, isTraining]);

  useEffect(() => {
    if (isTrainingComplete) {
      alert('학습이 완료되었습니다!');
      setIsTraining(projectKey, false);
      resetTrainingData(projectKey);
      setIsTrainingComplete(projectKey, false);
    }
  }, [isTrainingComplete, setIsTraining, resetTrainingData, setIsTrainingComplete, projectKey]);

  return (
    <ModelLineChart
      data={trainingDataList}
      className={className}
    />
  );
}
