import { DirectoryItem } from '@/types';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import ProjectFileItem from './ProjectFileItem';
import { cn } from '@/lib/utils';

export default function ProjectDirectoryItem({
  className = '',
  item,
  depth = 1,
}: {
  className?: string;
  item: DirectoryItem;
  depth?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const paddingLeft = depth * 12;

  return (
    <>
      <div
        className={cn('flex cursor-pointer items-center gap-2 rounded-md py-0.5 pr-1 hover:bg-gray-200', className)}
        style={{
          paddingLeft,
        }}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <button className="flex items-center">
          <ChevronRight
            size={16}
            className={`stroke-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          />
        </button>
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">{item.name}</span>
      </div>
      {item.children?.map((child) => {
        const childProps = {
          className: isExpanded ? '' : 'hidden',
          depth: depth + 1,
        };

        return child.type === 'directory' ? (
          <ProjectDirectoryItem
            key={`${item.name}-${child.name}`}
            item={child}
            {...childProps}
          />
        ) : (
          <ProjectFileItem
            key={`${item.name}-${child.name}`}
            item={child}
            {...childProps}
          />
        );
      })}
    </>
  );
}
