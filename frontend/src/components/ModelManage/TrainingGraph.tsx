import { useEffect, useMemo } from 'react';
import ModelLineChart from './ModelLineChart';
import usePollingModelReportsQuery from '@/queries/models/usePollingModelReportsQuery';
import useModelStore from '@/stores/useModelStore';

interface TrainingGraphProps {
  projectId: number | null;
  selectedModel: number | null;
}

export default function TrainingGraph({ projectId, selectedModel }: TrainingGraphProps) {
  const { isTrainingByProject, setIsTraining, resetTrainingData } = useModelStore((state) => ({
    isTrainingByProject: state.isTrainingByProject,
    setIsTraining: state.setIsTraining,
    resetTrainingData: state.resetTrainingData,
  }));

  const isTraining = isTrainingByProject[projectId?.toString() || ''] || false;

  const { data: trainingDataList } = usePollingModelReportsQuery(
    projectId as number,
    selectedModel ?? 0,
    isTraining && !!projectId && !!selectedModel
  );

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
      setIsTraining(projectId?.toString() || '', false);
      resetTrainingData(projectId?.toString() || '');
    }
  }, [latestData.epoch, latestData.totalEpochs, setIsTraining, resetTrainingData, projectId]);

  return (
    <ModelLineChart
      data={
        trainingDataList?.map((data) => ({
          epoch: data.epoch.toString(),
          loss1: data.boxLoss,
          loss2: data.clsLoss,
          loss3: data.dflLoss,
          fitness: data.fitness,
        })) || []
      }
      currentEpoch={latestData.epoch}
      totalEpochs={latestData.totalEpochs}
      remainingTime={latestData.leftSecond}
    />
  );
}
