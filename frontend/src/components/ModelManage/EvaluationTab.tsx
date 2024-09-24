import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import useProjectModelsQuery from '@/queries/models/useProjectModelsQuery';
import useModelReportsQuery from '@/queries/models/useModelReportsQuery';
import useModelResultsQuery from '@/queries/models/useModelResultsQuery';
import ModelBarChart from './ModelBarChart';
import ModelLineChart from './ModelLineChart';

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
  models: Array<{ id: number; name: string }> | undefined;
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
  const { data: reportData } = useModelReportsQuery(projectId, selectedModel);
  const { data: resultData } = useModelResultsQuery(selectedModel);

  if (!reportData || !resultData) {
    return null;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-6">
        <ModelBarChart
          data={[
            { name: 'precision', value: resultData[0]?.precision, fill: 'var(--color-precision)' },
            { name: 'recall', value: resultData[0]?.recall, fill: 'var(--color-recall)' },
            { name: 'mAP50', value: resultData[0]?.map50, fill: 'var(--color-map50)' },
            { name: 'mAP50_95', value: resultData[0]?.map5095, fill: 'var(--color-map50-95)' },
            { name: 'fitness', value: resultData[0]?.fitness, fill: 'var(--color-fitness)' },
          ]}
        />
      </div>

      <div className="flex flex-col gap-6">
        <ModelLineChart
          data={reportData.map((report) => ({
            epoch: report.epoch.toString(),
            loss1: report.boxLoss,
            loss2: report.clsLoss,
            loss3: report.dflLoss,
            fitness: report.fitness,
          }))}
        />
      </div>

      {/* <div className="flex flex-col justify-center">
        <LabelingPreview />
      </div> */}
    </div>
  );
}

// function LabelingPreview() {
//   return (
//     <div className="flex items-center justify-center rounded-lg border bg-white p-4">
//       <p>레이블링 프리뷰</p>
//     </div>
//   );
// }
