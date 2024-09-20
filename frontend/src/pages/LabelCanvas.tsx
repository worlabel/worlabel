import ImageCanvas from '@/components/ImageCanvas';
import { ResizablePanel } from '@/components/ui/resizable';
import WorkspaceLabelBar from '@/components/WorkspaceLabelBar';
import useCanvasStore from '@/stores/useCanvasStore';
import { Suspense } from 'react';

export default function LabelCanvas() {
  const image = useCanvasStore((state) => state.image);

  return (
    <ResizablePanel className="flex w-full items-center">
      <Suspense fallback={<div></div>}>
        <main className="h-full grow">
          {image ? (
            <ImageCanvas />
          ) : (
            <div className="body flex h-full w-full select-none items-center justify-center bg-gray-200 text-gray-400">
              이미지를 선택하세요.
            </div>
          )}
        </main>
        <WorkspaceLabelBar />
      </Suspense>
    </ResizablePanel>
  );
}
