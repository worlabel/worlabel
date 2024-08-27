import { cn } from '@/lib/utils';

interface CloseButtonProps {
  color?: string;
  onClick?: () => void;
  className?: string;
  size?: number;
}

export default function CloseButton({
  color = 'currentColor',
  onClick,
  className,
  size = 32,
}: CloseButtonProps): JSX.Element {
  return (
    <button
      className={cn('cursor-pointer border-none bg-none p-1', className)}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line
          x1={size * 0.75}
          y1={size * 0.25}
          x2={size * 0.25}
          y2={size * 0.75}
        ></line>
        <line
          x1={size * 0.25}
          y1={size * 0.25}
          x2={size * 0.75}
          y2={size * 0.75}
        ></line>
      </svg>
    </button>
  );
}
