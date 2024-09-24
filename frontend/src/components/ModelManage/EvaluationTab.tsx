import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ModelBarChart from '@/components/ModelBarChart';

interface EvaluationTabProps {
  selectedModel: string | null;
  setSelectedModel: (model: string | null) => void;
}

export default function EvaluationTab({ selectedModel, setSelectedModel }: EvaluationTabProps) {
  return (
    <div>
      <div className="mb-4">
        <Label htmlFor="select-model">모델 선택</Label>
        <Select onValueChange={setSelectedModel}>
          <SelectTrigger id="select-model">
            <SelectValue placeholder="모델을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="genesis">Genesis</SelectItem>
            <SelectItem value="explorer">Explorer</SelectItem>
            <SelectItem value="quantum">Quantum</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedModel && (
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <ModelBarChart
              data={[
                { name: 'precision', value: 0.734, fill: 'var(--color-precision)' },
                { name: 'recall', value: 0.75, fill: 'var(--color-recall)' },
                { name: 'mAP50', value: 0.995, fill: 'var(--color-map50)' },
                { name: 'mAP50_95', value: 0.97, fill: 'var(--color-map50-95)' },
                { name: 'fitness', value: 0.973, fill: 'var(--color-fitness)' },
              ]}
            />
          </div>
          <div className="flex flex-col justify-center">
            <LabelingPreview />
          </div>
        </div>
      )}
    </div>
  );
}

function LabelingPreview() {
  return (
    <div className="flex items-center justify-center rounded-lg border bg-white p-4">
      <p>레이블링 프리뷰</p>
    </div>
  );
}
