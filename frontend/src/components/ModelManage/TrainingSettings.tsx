import SelectWithLabel from './SelectWithLabel';
import InputWithLabel from './InputWithLabel';
import { Button } from '@/components/ui/button';
import useProjectModelsQuery from '@/queries/models/useProjectModelsQuery';
import { ModelTrainRequest } from '@/types';
import { useState } from 'react';

interface TrainingSettingsProps {
  projectId: number | null;
  selectedModel: number | null;
  setSelectedModel: (model: number | null) => void;
  handleTrainingStart: (trainData: ModelTrainRequest) => void;
  handleTrainingStop: () => void;
  isTraining: boolean;
}

export default function TrainingSettings({
  projectId,
  selectedModel,
  setSelectedModel,
  handleTrainingStart,
  handleTrainingStop,
  isTraining,
}: TrainingSettingsProps) {
  const { data: models } = useProjectModelsQuery(projectId ?? 0);

  const [ratio, setRatio] = useState<number>(0.8);
  const [epochs, setEpochs] = useState<number>(50);
  const [batchSize, setBatchSize] = useState<number>(32);
  const [optimizer, setOptimizer] = useState<'SGD' | 'AUTO' | 'ADAM' | 'ADAMW' | 'NADAM' | 'RADAM' | 'RMSPROP'>('AUTO');
  const [lr0, setLr0] = useState<number>(0.01);
  const [lrf, setLrf] = useState<number>(0.001);

  const handleSubmit = () => {
    if (isTraining) {
      handleTrainingStop();
    } else if (selectedModel !== null) {
      const trainData: ModelTrainRequest = {
        modelId: selectedModel,
        ratio,
        epochs,
        batch: batchSize,
        optimizer,
        lr0,
        lrf,
      };
      handleTrainingStart(trainData);
    }
  };

  return (
    <fieldset
      className="grid gap-6 rounded-lg border p-4"
      disabled={isTraining}
    >
      <legend className="-ml-1 px-1 text-sm font-medium">모델 설정</legend>

      <div className="grid gap-3">
        <SelectWithLabel
          label="모델 선택"
          id="model"
          options={
            models?.map((model) => ({
              label: model.name,
              value: model.id.toString(),
            })) || []
          }
          placeholder="모델을 선택하세요"
          value={selectedModel ? selectedModel.toString() : ''}
          onChange={(value) => setSelectedModel(parseInt(value, 10))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputWithLabel
          label="훈련/검증 비율"
          placeholder="예: 0.8 (80% 훈련, 20% 검증)"
          id="ratio"
          value={ratio}
          onChange={(e) => setRatio(parseFloat(e.target.value))}
        />
        <InputWithLabel
          label="에포크 수"
          placeholder="예: 50 (총 반복 횟수)"
          id="epochs"
          value={epochs}
          onChange={(e) => setEpochs(parseInt(e.target.value, 10))}
        />
        <InputWithLabel
          label="Batch 크기"
          placeholder="예: 32 (한번에 처리할 샘플 수)"
          id="batch"
          value={batchSize}
          onChange={(e) => setBatchSize(parseInt(e.target.value, 10))}
        />
        <SelectWithLabel
          label="옵티마이저"
          id="optimizer"
          options={[
            { label: 'AUTO', value: 'AUTO' },
            { label: 'SGD', value: 'SGD' },
            { label: 'ADAM', value: 'ADAM' },
            { label: 'ADAMW', value: 'ADAMW' },
            { label: 'NADAM', value: 'NADAM' },
            { label: 'RADAM', value: 'RADAM' },
            { label: 'RMSPROP', value: 'RMSPROP' },
          ]}
          placeholder="옵티마이저 선택"
          value={optimizer}
          onChange={(value) => setOptimizer(value as 'AUTO' | 'SGD' | 'ADAM' | 'ADAMW' | 'NADAM' | 'RADAM' | 'RMSPROP')}
        />
        <InputWithLabel
          label="학습률(LR0)"
          placeholder="예: 0.01 (초기 학습률)"
          id="lr0"
          value={lr0}
          onChange={(e) => setLr0(parseFloat(e.target.value))}
        />
        <InputWithLabel
          label="최종 학습률(LRF)"
          placeholder="예: 0.001 (최종 학습률)"
          id="lrf"
          value={lrf}
          onChange={(e) => setLrf(parseFloat(e.target.value))}
        />
      </div>

      <Button
        variant="outlinePrimary"
        size="lg"
        onClick={handleSubmit}
        disabled={!selectedModel || isTraining}
      >
        {isTraining ? '학습 중단' : '학습 시작'}
      </Button>
    </fieldset>
  );
}
