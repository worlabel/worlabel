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
        <header className="bg-background flex h-16 items-center gap-1 border-b border-gray-200 px-4">
          <h1 className="heading">모델 관리</h1>
        </header>

        <main className="grid flex-1 gap-4 overflow-auto p-4">
          <Tabs
            defaultValue="train"
            className="w-full"
          >
            {/* TabsList랑 TabsTrigger 디자인이 shadcn 문서에서 본 것과 많이 다르고 이상함.. 그래서 일단 className을 일일이 지정함.. */}
            <TabsList className="rounded-none border-transparent bg-transparent shadow-none">
              <TabsTrigger
                value="train"
                className="rounded-none border-b-2 border-transparent bg-transparent shadow-none data-[state=active]:border-blue-500 data-[state=active]:shadow-none"
              >
                모델 학습
              </TabsTrigger>
              <TabsTrigger
                value="results"
                className="rounded-none border-b-2 border-transparent bg-transparent shadow-none data-[state=active]:border-blue-500 data-[state=active]:shadow-none"
              >
                모델 평가
              </TabsTrigger>
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
