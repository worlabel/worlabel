import { Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  title: string;
  imageUrl?: string;
  onClick?: () => void;
}

export default function ProjectCard({ title, imageUrl, onClick }: ProjectCardProps): JSX.Element {
  return (
    <div
      onClick={onClick}
      className={cn('relative flex h-60 w-[295px] cursor-pointer flex-col items-center gap-3 bg-white')}
    >
      <div className={cn('flex w-full flex-1 items-center justify-center bg-gray-100')}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className={cn('h-36 w-full object-cover')}
          />
        ) : (
          <div className={cn('flex h-full w-full items-center justify-center')}>
            <Compass
              className="h-12 w-12"
              color="#757575"
            />
          </div>
        )}
      </div>
      <div className={cn('flex w-full items-end px-4 pb-4')}>
        <div
          className={cn(
            'font-body mt-[-1px] w-fit whitespace-nowrap text-center text-[length:var(--body-font-size)] font-[number:var(--body-font-weight)] leading-[var(--body-line-height)] tracking-[var(--body-letter-spacing)] text-black'
          )}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
