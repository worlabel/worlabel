import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useProjectModelsQuery from '@/queries/models/useProjectModelsQuery';
import useCompletedModelReport from '@/queries/reports/useCompletedModelReport';
import useModelResultsQuery from '@/queries/results/useModelResultQuery';
import ModelBarChart from './ModelBarChart';
import ModelLineChart from './ModelLineChart';
import { useState } from 'react';
import { ModelResponse } from '@/types';

interface EvaluationTabProps {
  projectId: number | null;
}

export default function EvaluationTab({ projectId }: EvaluationTabProps) {
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const { data: models } = useProjectModelsQuery(projectId ?? 0);

  return (
    <div>
      <ModelSelection
        models={models}
        setSelectedModel={setSelectedModel}
      />

      {selectedModel && (
        <ModelEvaluation
          projectId={projectId as number}
          selectedModel={selectedModel}
        />
      )}
    </div>
  );
}

interface ModelSelectionProps {
  models: ModelResponse[] | undefined;
  setSelectedModel: (modelId: number) => void;
}

function ModelSelection({ models, setSelectedModel }: ModelSelectionProps) {
  return (
    <div className="mb-4">
      <Label htmlFor="select-model">모델 선택</Label>
      <Select onValueChange={(value) => setSelectedModel(parseInt(value))}>
        <SelectTrigger id="select-model">
          <SelectValue placeholder="모델을 선택하세요" />
        </SelectTrigger>
        <SelectContent>
          {models?.map((model) => (
            <SelectItem
              key={model.id}
              value={model.id.toString()}
              disabled={model.isDefault}
            >
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface ModelEvaluationProps {
  projectId: number;
  selectedModel: number;
}

function ModelEvaluation({ projectId, selectedModel }: ModelEvaluationProps) {
  const { data: reportData } = useCompletedModelReport(projectId, selectedModel);
  const { data: resultData } = useModelResultsQuery(selectedModel);

  if (!reportData || !resultData) return null;

  const trainingInfoRow = (
    <div className="flex justify-between rounded-lg bg-gray-100 p-4">
      <div className="flex-1 text-center">
        <strong>Epochs</strong>
        <p>{resultData[0]?.epochs}</p>
      </div>
      <div className="flex-1 text-center">
        <strong>Batch Size</strong>
        <p>{resultData[0]?.batch}</p>
      </div>
      <div className="flex-1 text-center">
        <strong>Learning Rate (Start)</strong>
        <p>{resultData[0]?.lr0}</p>
      </div>
      <div className="flex-1 text-center">
        <strong>Learning Rate (End)</strong>
        <p>{resultData[0]?.lrf}</p>
      </div>
      <div className="flex-1 text-center">
        <strong>Optimizer</strong>
        <p>{resultData[0]?.optimizer}</p>
      </div>
    </div>
  );

  return (
    <div>
      {trainingInfoRow} {/* 학습 정보 표시 */}
      <div className="mt-4 grid h-[400px] gap-8 md:grid-cols-2">
        {' '}
        {/* grid와 높이 설정 */}
        <div className="flex h-full flex-col gap-6">
          {' '}
          {/* 차트의 높이를 100%로 맞춤 */}
          <ModelBarChart
            data={[
              { name: 'precision', value: resultData[0]?.precision, fill: 'var(--color-precision)' },
              { name: 'recall', value: resultData[0]?.recall, fill: 'var(--color-recall)' },
              { name: 'mAP50', value: resultData[0]?.map50, fill: 'var(--color-map50)' },
              { name: 'mAP50_95', value: resultData[0]?.map5095, fill: 'var(--color-map50-95)' },
              { name: 'fitness', value: resultData[0]?.fitness, fill: 'var(--color-fitness)' },
            ]}
            className="h-full"
          />
        </div>
        <div className="flex h-full flex-col gap-6">
          {' '}
          {/* 차트의 높이를 100%로 맞춤 */}
          <ModelLineChart
            data={reportData}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
