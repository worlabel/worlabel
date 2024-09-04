import { LucideIcon, MousePointer2, PenTool, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CanvasControlBar() {
  const buttonBaseClassName = 'rounded-lg p-2 transition-colors ';
  const buttonClassName = 'hover:bg-gray-100';
  const controls: { [key: string]: LucideIcon } = {
    pointer: MousePointer2,
    rect: Square,
    pen: PenTool,
  };

  return (
    <div className="fixed bottom-14 left-[50%] flex translate-x-[-50%] items-center gap-2 rounded-xl bg-white p-1 shadow-xl">
      {Object.keys(controls).map((control) => {
        const Icon = controls[control];
        return (
          <button
            key={control}
            className={cn(buttonClassName, buttonBaseClassName)}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </div>
  );
}
