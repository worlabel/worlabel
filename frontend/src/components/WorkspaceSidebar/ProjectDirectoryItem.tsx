import { ChildFolder } from '@/types';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function ProjectDirectoryItem({
  className = '',
  item,
  depth = 0,
  initialExpanded = false,
}: {
  className?: string;
  item: ChildFolder;
  depth?: number;
  initialExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
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
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">{item.title}</span>
      </div>
      {/* TODO: nested 폴더 구조 적용 */}
    </>
  );
}
