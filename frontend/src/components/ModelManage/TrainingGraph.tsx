import ModelLineChart from './ModelLineChart';
import usePollingModelReportsQuery from '@/queries/models/usePollingModelReportsQuery';

interface TrainingGraphProps {
  projectId: number | null;
  selectedModel: number | null;
}

export default function TrainingGraph({ projectId, selectedModel }: TrainingGraphProps) {
  const { data: trainingDataList } = usePollingModelReportsQuery(projectId as number, selectedModel ?? 0);

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
    />
  );
}
