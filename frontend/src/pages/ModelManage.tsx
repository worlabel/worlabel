import { Rabbit, Bird, Turtle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ModelLineChart from '@/components/ModelLineChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import ModelBarChart from '@/components/ModelBarChart';

export default function ModelManage() {
  interface MetricData {
    epoch: string;
    loss1: number;
    loss2: number;
    loss3: number;
    fitness: number;
  }

  const dummyLossData: MetricData[] = [
    { epoch: '1', loss1: 0.45, loss2: 0.43, loss3: 0.42, fitness: 0.97 },
    { epoch: '2', loss1: 0.4, loss2: 0.38, loss3: 0.37, fitness: 0.98 },
    { epoch: '3', loss1: 0.38, loss2: 0.36, loss3: 0.35, fitness: 0.99 },
    { epoch: '4', loss1: 0.36, loss2: 0.34, loss3: 0.33, fitness: 1.0 },
  ];

  const [lossData] = useState<MetricData[]>(dummyLossData);
  const [training, setTraining] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const handleTrainingToggle = () => {
    setTraining((prev) => !prev);
  };

  return (
    <div className="grid h-screen w-full pl-[56px]">
      <div className="flex flex-col">
        <header className="bg-background sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b px-4">
          <h1 className="text-xl font-semibold">모델 관리</h1>
        </header>

        <main className="grid flex-1 gap-4 overflow-auto p-4">
          <Tabs
            defaultValue="train"
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="train">모델 학습</TabsTrigger>
              <TabsTrigger value="results">모델 평가</TabsTrigger>
            </TabsList>

            {/* 모델 학습 탭 */}
            <TabsContent value="train">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="flex flex-col gap-6">
                  <SettingsForm />
                  <Button
                    variant={training ? 'destructive' : 'outlinePrimary'}
                    size="lg"
                    onClick={handleTrainingToggle}
                  >
                    {training ? '학습 중단' : '학습 시작'}
                  </Button>
                </div>
                <div className="flex flex-col justify-center">
                  <ModelLineChart data={lossData} />
                </div>
              </div>
            </TabsContent>

            {/* 모델 평가 탭 */}
            <TabsContent value="results">
              {/* 모델 선택 */}
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

              {/* 선택된 모델에 따른 BarChart 및 Labeling Preview */}
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
            </TabsContent>
          </Tabs>
        </main>
      </div>
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

function SettingsForm() {
  return (
    <form className="grid w-full gap-6">
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">모델 설정</legend>
        <div className="grid gap-3">
          <Label htmlFor="model">모델 선택</Label>
          <Select>
            <SelectTrigger id="model">
              <SelectValue placeholder="모델을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="genesis">
                <OptionWithIcon
                  icon={<Rabbit />}
                  title="Genesis"
                  description="일반 사용 사례를 위한 빠른 모델"
                />
              </SelectItem>
              <SelectItem value="explorer">
                <OptionWithIcon
                  icon={<Bird />}
                  title="Explorer"
                  description="효율성을 위한 빠른 모델"
                />
              </SelectItem>
              <SelectItem value="quantum">
                <OptionWithIcon
                  icon={<Turtle />}
                  title="Quantum"
                  description="복잡한 계산을 위한 강력한 모델"
                />
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputWithLabel
            label="훈련/검증 비율"
            placeholder="0.8"
            id="ratio"
          />
          <InputWithLabel
            label="에포크 수"
            placeholder="50"
            id="epochs"
          />
          <InputWithLabel
            label="Batch"
            placeholder="-1"
            id="batch"
          />
          <SelectWithLabel
            label="옵티마이저"
            id="optimizer"
            options={['SGD', 'Adam', 'AdamW', 'NAdam', 'RAdam', 'RMSProp']}
            placeholder="옵티마이저 선택"
          />
          <InputWithLabel
            label="학습률(LR0)"
            placeholder="0.01"
            id="lr0"
          />
          <InputWithLabel
            label="학습률(LRF)"
            placeholder="0.01"
            id="lrf"
          />
        </div>
      </fieldset>
    </form>
  );
}

interface OptionWithIconProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

function OptionWithIcon({ icon, title, description }: OptionWithIconProps) {
  return (
    <div className="text-muted-foreground flex items-start gap-3">
      {icon}
      <div className="grid gap-0.5">
        <p>
          Neural <span className="text-foreground font-medium">{title}</span>
        </p>
        <p
          className="text-xs"
          data-description
        >
          {description}
        </p>
      </div>
    </div>
  );
}

interface InputWithLabelProps {
  label: string;
  id: string;
  placeholder: string;
}

function InputWithLabel({ label, id, placeholder }: InputWithLabelProps) {
  return (
    <div className="grid gap-3">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        placeholder={placeholder}
      />
    </div>
  );
}
interface SelectWithLabelProps {
  label: string;
  id: string;
  options: string[];
  placeholder: string;
}

function SelectWithLabel({ label, id, options, placeholder }: SelectWithLabelProps) {
  return (
    <div className="grid gap-3">
      <Label htmlFor={id}>{label}</Label>
      <Select>
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
