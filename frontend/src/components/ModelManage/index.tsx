import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'react-router-dom';
import TrainingTab from './TrainingTab';
import EvaluationTab from './EvaluationTab';

export default function ModelManage() {
  const { projectId } = useParams<{ projectId?: string }>();
  const numericProjectId = projectId ? parseInt(projectId, 10) : null;

  return (
    <div className="grid h-screen w-full">
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

            <TabsContent value="train">
              <TrainingTab projectId={numericProjectId} />
            </TabsContent>

            <TabsContent value="results">
              <EvaluationTab projectId={numericProjectId} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
