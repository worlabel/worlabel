import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useProjectModelsQuery from '@/queries/models/useProjectModelsQuery';
import { useState } from 'react';

interface SettingsFormProps {
  projectId: string | null; // projectId를 프랍으로 받음
  onSubmit?: (data: SettingsFormData) => void;
}

export interface SettingsFormData {
  projectId: number | null;
  selectedModel: string | null;
  ratio: number;
  epochs: number;
  batchSize: number;
  optimizer: string;
  lr0: number;
  lrf: number;
}

export default function SettingsForm({ projectId, onSubmit }: SettingsFormProps) {
  const numericProjectId = projectId ? parseInt(projectId, 10) : null;

  const { data: models } = useProjectModelsQuery(numericProjectId ?? 0);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [ratio, setRatio] = useState<number>(0.8);
  const [epochs, setEpochs] = useState<number>(50);
  const [batchSize, setBatchSize] = useState<number>(32);
  const [optimizer, setOptimizer] = useState<string>('SGD');
  const [lr0, setLr0] = useState<number>(0.01);
  const [lrf, setLrf] = useState<number>(0.001);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        projectId: numericProjectId,
        selectedModel,
        ratio,
        epochs,
        batchSize,
        optimizer,
        lr0,
        lrf,
      });
    }
  };

  return (
    <form
      className="grid w-full gap-6"
      onSubmit={handleSubmit}
    >
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">모델 설정</legend>

        {/* 모델 선택 */}
        <div className="grid gap-3">
          <Label htmlFor="model">모델 선택</Label>
          <Select onValueChange={setSelectedModel}>
            <SelectTrigger id="model">
              <SelectValue placeholder="모델을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {models?.map((model) => (
                <SelectItem
                  key={model.id}
                  value={model.name}
                >
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 훈련/검증 비율 및 학습 파라미터 */}
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
            options={['SGD', 'Adam', 'AdamW', 'NAdam', 'RAdam', 'RMSProp']}
            value={optimizer}
            onChange={setOptimizer}
            placeholder="옵티마이저 선택"
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

        <button
          type="submit"
          className="btn-primary"
        >
          설정 저장
        </button>
      </fieldset>
    </form>
  );
}

interface InputWithLabelProps {
  label: string;
  id: string;
  placeholder: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputWithLabel({ label, id, placeholder, value, onChange }: InputWithLabelProps) {
  return (
    <div className="grid gap-3">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

interface SelectWithLabelProps {
  label: string;
  id: string;
  options: string[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

function SelectWithLabel({ label, id, options, placeholder, onChange }: SelectWithLabelProps) {
  return (
    <div className="grid gap-3">
      <Label htmlFor={id}>{label}</Label>
      <Select onValueChange={onChange}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
