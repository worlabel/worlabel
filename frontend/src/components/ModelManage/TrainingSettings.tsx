import SelectWithLabel from './SelectWithLabel';
import InputWithLabel from './InputWithLabel';
import { Button } from '@/components/ui/button';
import useProjectModelsQuery from '@/queries/models/useProjectModelsQuery';
import { ModelTrainRequest, ModelResponse } from '@/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TrainingSettingsProps {
  projectId: number | null;
  selectedModel: ModelResponse | null;
  setSelectedModel: (model: ModelResponse | null) => void;
  handleTrainingStart: (trainData: ModelTrainRequest) => void;
  handleTrainingStop: () => void;
  className?: string;
}

export default function TrainingSettings({
  projectId,
  selectedModel,
  setSelectedModel,
  handleTrainingStart,
  handleTrainingStop,
  className,
}: TrainingSettingsProps) {
  const { data: models } = useProjectModelsQuery(projectId ?? 0);
  const [ratio, setRatio] = useState<number>(0.8);
  const [epochs, setEpochs] = useState<number>(50);
  const [batchSize, setBatchSize] = useState<number>(32);
  const [optimizer, setOptimizer] = useState<'SGD' | 'AUTO' | 'ADAM' | 'ADAMW' | 'NADAM' | 'RADAM' | 'RMSPROP'>('AUTO');
  const [lr0, setLr0] = useState<number>(0.01);
  const [lrf, setLrf] = useState<number>(0.001);

  const handleSubmit = () => {
    if (selectedModel?.isTrain) {
      handleTrainingStop();
    } else if (selectedModel) {
      const trainData: ModelTrainRequest = {
        modelId: selectedModel.id,
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
    <fieldset className={cn('grid gap-6 rounded-lg border p-4', className)}>
      <legend className="-ml-1 px-1 text-sm font-medium">모델 설정</legend>
      <div className="grid gap-3">
        <SelectWithLabel
          label="모델 선택"
          id="model"
          options={
            models?.map((model) => ({
              label: `${model.name}${model.isTrain ? ' (학습 중)' : ''}${model.isDefault ? ' (기본)' : ''}`,
              value: model.id.toString(),
            })) || []
          }
          placeholder="모델을 선택하세요"
          value={selectedModel ? selectedModel.id.toString() : ''}
          onChange={(value) => {
            const selected = models?.find((model) => model.id === parseInt(value, 10));
            setSelectedModel(selected || null);
          }}
        />
      </div>
      {!selectedModel?.isTrain && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <InputWithLabel
              label="훈련/검증 비율"
              id="ratio"
              value={ratio}
              onChange={(e) => setRatio(parseFloat(e.target.value))}
              placeholder="훈련/검증 비율"
            />
            <InputWithLabel
              label="에포크 수"
              id="epochs"
              value={epochs}
              onChange={(e) => setEpochs(parseInt(e.target.value, 10))}
              placeholder="에포크 수"
            />
            <InputWithLabel
              label="Batch 크기"
              id="batch"
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value, 10))}
              placeholder="Batch 크기"
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
              value={optimizer}
              onChange={(value) =>
                setOptimizer(value as 'AUTO' | 'SGD' | 'ADAM' | 'ADAMW' | 'NADAM' | 'RADAM' | 'RMSPROP')
              }
              placeholder="옵티마이저"
            />
            <InputWithLabel
              label="학습률(LR0)"
              id="lr0"
              value={lr0}
              onChange={(e) => setLr0(parseFloat(e.target.value))}
              placeholder="초기 학습률"
            />
            <InputWithLabel
              label="최종 학습률(LRF)"
              id="lrf"
              value={lrf}
              onChange={(e) => setLrf(parseFloat(e.target.value))}
              placeholder="최종 학습률"
            />
          </div>
          <Button
            variant="outlinePrimary"
            size="lg"
            onClick={handleSubmit}
            disabled={!selectedModel}
          >
            {selectedModel?.isTrain ? '학습 중단' : '학습 시작'}
          </Button>
        </>
      )}
    </fieldset>
  );
}
