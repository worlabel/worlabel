import { Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  onClick?: () => void;
}

export default function ProjectCard({ title, description, imageUrl, onClick }: ProjectCardProps): JSX.Element {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative flex w-[327px] cursor-pointer items-start gap-4 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800',
        'transition-transform hover:scale-105'
      )}
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          <Compass className="h-8 w-8 text-gray-500" />
        )}
      </div>
      <div className="flex flex-1 flex-col items-start gap-1">
        <div className="font-sans text-lg leading-tight text-black dark:text-white">{title}</div>
        <div className="text-sm leading-tight text-gray-500 dark:text-gray-400">{description}</div>
      </div>
    </div>
  );
}
