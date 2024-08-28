import { cn } from '@/lib/utils';
import { Button as BaseButton, ButtonProps as BaseButtonProps } from '@/components/ui/button';

interface ProgressButtonProps extends BaseButtonProps {
  isActive: boolean;
  progress?: number;
  text: string;
}

export default function ProgressButton({
  isActive,
  text,
  progress = 0,
  variant,
  size,
  className,
  ...props
}: ProgressButtonProps): JSX.Element {
  const buttonText = progress === 100 ? '업로드 완료' : text;

  return (
    <BaseButton
      className={cn('relative w-full overflow-hidden', className)}
      variant={variant}
      size={size}
      disabled={!isActive}
      {...props}
    >
      {progress > 0 && (
        <div
          className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      )}

      <span className={cn('relative z-10', progress > 0 && 'text-white')}>{buttonText}</span>
    </BaseButton>
  );
}
