import { Project } from '@/types';
import { ChevronRight, SquarePenIcon, Upload } from 'lucide-react';
import { useState } from 'react';
import ProjectFileItem from './ProjectFileItem';
import ProjectDirectoryItem from './ProjectDirectoryItem';

export default function ProjectStructure({ project }: { project: Project }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex select-none flex-col px-1 pb-2">
      <header className="flex w-full items-center gap-2 rounded px-1 hover:bg-gray-200">
        <div
          className="flex w-full cursor-pointer items-center gap-1 overflow-hidden pr-1"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <button>
            <ChevronRight
              size={16}
              className={`stroke-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          </button>
          <div className="flex flex-col overflow-hidden">
            <h2 className="body-small-strong overflow-hidden text-ellipsis whitespace-nowrap">{project.name}</h2>
            <h3 className="caption overflow-hidden text-ellipsis whitespace-nowrap">{project.type}</h3>
          </div>
        </div>
        <button
          className="flex gap-1"
          onClick={() => console.log('edit project')}
        >
          <SquarePenIcon size={16} />
        </button>
        <button
          className="flex gap-1"
          onClick={() => console.log('upload image')}
        >
          <Upload size={16} />
        </button>
      </header>
      <div className={`caption flex flex-col ${isExpanded ? '' : 'hidden'}`}>
        {project.children.map((item) =>
          item.type === 'directory' ? (
            <ProjectDirectoryItem
              key={`${project.id}-${item.name}`}
              item={item}
              className={isExpanded ? '' : 'hidden'}
            />
          ) : (
            <ProjectFileItem
              key={`${project.id}-${item.name}`}
              item={item}
              className={isExpanded ? '' : 'hidden'}
            />
          )
        )}
      </div>
    </div>
  );
}
