import useCanvasStore from '@/stores/useCanvasStore';
import { BookmarkPlus, LucideIcon, MousePointer2, PenTool, Save, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';
import { LabelCategoryResponse } from '@/types';

export default function CanvasControlBar({
  saveJson,
  projectType,
  categories,
}: {
  saveJson: () => void;
  projectType: 'classification' | 'detection' | 'segmentation';
  categories: LabelCategoryResponse[];
}) {
  const { drawState, setDrawState, setLabels, labels } = useCanvasStore();
  const buttonBaseClassName = 'rounded-lg p-2 transition-colors';
  const buttonClassName = 'hover:bg-gray-100';
  const activeButtonClassName = 'bg-primary stroke-white';

  const controls: { [key: string]: LucideIcon } = {
    pointer: MousePointer2,
    ...(projectType === 'segmentation' ? { pen: PenTool } : projectType === 'detection' ? { rect: Square } : null),
    comment: MessageSquare,
  };

  return (
    <div className="fixed bottom-10 left-[50%] flex translate-x-[-50%] items-center gap-2 rounded-xl bg-white p-1 shadow-xl">
      {Object.keys(controls).map((control) => {
        const Icon = controls[control];
        return (
          <button
            key={control}
            className={cn(drawState === control ? activeButtonClassName : buttonClassName, buttonBaseClassName)}
            onClick={() => setDrawState(control as typeof drawState)}
          >
            <Icon
              size={20}
              color={drawState === control ? 'white' : 'black'}
            />
          </button>
        );
      })}

      {projectType === 'classification' && (
        <button
          className={cn(labels.length === 0 ? buttonClassName : '', buttonBaseClassName)}
          onClick={() => {
            setLabels([
              {
                id: 0,
                categoryId: categories[0]!.id,
                color: '#1177ff',
                type: 'point',
                coordinates: [[0, 0]],
              },
            ]);
          }}
          disabled={labels.length !== 0}
        >
          <BookmarkPlus
            size={20}
            color={labels.length === 0 ? 'black' : 'gray'}
          />
        </button>
      )}

      <div className="h-5 w-0.5 rounded bg-gray-400" />

      <button
        className={cn(buttonClassName, buttonBaseClassName)}
        onClick={saveJson}
      >
        <Save
          size={20}
          color="black"
        />
      </button>
    </div>
  );
}
