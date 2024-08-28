import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CloseButtonProps {
  color?: string;
  onClick?: () => void;
  className?: string;
  size?: number;
}

export default function CloseButton({
  color = '#1e1e1e',
  onClick,
  className,
  size = 32,
}: CloseButtonProps): JSX.Element {
  return (
    <button
      className={cn('cursor-pointer border-none bg-none p-1', className)}
      onClick={onClick}
    >
      <X
        color={color}
        size={size}
        strokeWidth="2"
      />
    </button>
  );
}
