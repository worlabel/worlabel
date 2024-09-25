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
  const { isTrainingByProject, setIsTraining, saveTrainingData, resetTrainingData, trainingDataByProject } =
    useModelStore((state) => ({
      isTrainingByProject: state.isTrainingByProject,
      setIsTraining: state.setIsTraining,
      saveTrainingData: state.saveTrainingData,
      resetTrainingData: state.resetTrainingData,
      trainingDataByProject: state.trainingDataByProject,
    }));

  const isTraining = isTrainingByProject[projectId?.toString() || ''] || false;

  const { data: fetchedTrainingDataList } = usePollingModelReportsQuery(
    projectId as number,
    selectedModel ?? 0,
    isTraining && !!projectId && !!selectedModel
  );

  const trainingDataList = useMemo(() => {
    return trainingDataByProject[projectId?.toString() || ''] || fetchedTrainingDataList || [];
  }, [projectId, trainingDataByProject, fetchedTrainingDataList]);

  useEffect(() => {
    if (fetchedTrainingDataList) {
      saveTrainingData(projectId?.toString() || '', fetchedTrainingDataList);
    }
  }, [fetchedTrainingDataList, projectId, saveTrainingData]);

  const latestData = useMemo(() => {
    return (
      trainingDataList?.[trainingDataList.length - 1] || {
        epoch: 0,
        totalEpochs: 0,
        leftSecond: 0,
      }
    );
  }, [trainingDataList]);

  useEffect(() => {
    if (latestData.epoch === latestData.totalEpochs && latestData.totalEpochs > 0) {
      alert('학습이 완료되었습니다!');
      setIsTraining(projectId?.toString() || '', false);
      resetTrainingData(projectId?.toString() || '');
    }
  }, [latestData.epoch, latestData.totalEpochs, setIsTraining, resetTrainingData, projectId]);

  return (
    <ModelLineChart
      data={trainingDataList}
      className={className}
    />
  );
}
