import ImageCanvas from '@/components/ImageCanvas';
import { ResizablePanel } from '@/components/ui/resizable';
import WorkspaceLabelBar from '@/components/WorkspaceLabelBar';

export default function LabelCanvas() {
  return (
    <ResizablePanel className="flex w-full items-center">
      <main className="h-full grow">
        <ImageCanvas />
      </main>
      <WorkspaceLabelBar />
    </ResizablePanel>
  );
}
