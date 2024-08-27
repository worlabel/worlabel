import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  isActive: boolean;
  text: string;
  onClick: () => void;
  progress?: number;
}

export default function Button({ isActive, text, onClick, progress = 0 }: ButtonProps): JSX.Element {
  const buttonText = progress === 100 ? '업로드 완료' : text;

  return (
    <button
      className={cn(
        'relative flex h-12 w-full items-center justify-center rounded-lg border-2 px-5 py-2.5 transition-all duration-300',
        isActive
          ? 'cursor-pointer border-primary bg-primary text-white'
          : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500'
      )}
      disabled={!isActive}
      onClick={isActive ? onClick : undefined}
      style={{ '--progress-width': `${progress}%` } as React.CSSProperties}
    >
      <span className="relative z-10 font-sans text-base font-bold leading-6">{buttonText}</span>
      <div
        className="absolute top-0 left-0 z-0 h-full duration-300 bg-white transition-width bg-opacity-20"
        style={{ width: `var(--progress-width, 0%)` }}
      ></div>
    </button>
  );
}
