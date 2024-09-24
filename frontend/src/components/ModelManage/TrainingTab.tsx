import { Button } from '@/components/ui/button';
import ModelLineChart from '@/components/ModelLineChart';
import SettingsForm from './SettingsForm';

interface TrainingTabProps {
  training: boolean;
  handleTrainingToggle: () => void;
  trainingDataList: {
    epoch: number;
    box_loss: number;
    cls_loss: number;
    dfl_loss: number;
    fitness: number;
  }[];
  projectId: string | null; // projectId를 프랍으로 받음
}

export default function TrainingTab({ training, handleTrainingToggle, trainingDataList, projectId }: TrainingTabProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-6">
        <SettingsForm projectId={projectId} />
        <Button
          variant={training ? 'destructive' : 'outlinePrimary'}
          size="lg"
          onClick={handleTrainingToggle}
        >
          {training ? '학습 중단' : '학습 시작'}
        </Button>
      </div>

      <div className="flex flex-col justify-center">
        <ModelLineChart
          data={trainingDataList.map((data) => ({
            epoch: data.epoch.toString(),
            loss1: data.box_loss,
            loss2: data.cls_loss,
            loss3: data.dfl_loss,
            fitness: data.fitness,
          }))}
        />
      </div>
    </div>
  );
}
