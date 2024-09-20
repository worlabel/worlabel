import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  title: string;
  description: string;
  to?: string;
  imageUrl?: string;
}

export default function ProjectCard({ title, description, imageUrl = '', to = '' }: ProjectCardProps): JSX.Element {
  return (
    <Link
      to={to}
      className="relative flex w-[327px] cursor-pointer items-start gap-4 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50"
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
    </Link>
  );
}
