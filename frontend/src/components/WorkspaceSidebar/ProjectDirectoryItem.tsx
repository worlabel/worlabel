import { ChildFolder } from '@/types';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import useFolderQuery from '@/queries/folders/useFolderQuery';
import useCanvasStore from '@/stores/useCanvasStore';
import ProjectFileItem from './ProjectFileItem';

export default function ProjectDirectoryItem({
  className = '',
  projectId,
  item,
  depth = 0,
  initialExpanded = false,
}: {
  className?: string;
  projectId: number;
  item: ChildFolder;
  depth?: number;
  initialExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const paddingLeft = depth * 12;
  const { data: folderData } = useFolderQuery(projectId.toString(), item.id);
  const image = useCanvasStore((state) => state.image);

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
            className={cn('stroke-gray-500 transition-transform', isExpanded ? 'rotate-90' : '')}
          />
        </button>
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">{item.title}</span>
      </div>
      {
        <div className={cn('caption flex flex-col', isExpanded ? '' : 'hidden')}>
          {folderData.children.map((item) => (
            <ProjectDirectoryItem
              key={`${projectId}-${item.title}`}
              projectId={projectId}
              item={item}
              depth={depth + 1}
            />
          ))}
          {folderData.images.map((item) => (
            <ProjectFileItem
              key={`${projectId}-${item.imageTitle}`}
              item={item}
              depth={depth + 1}
              folderId={folderData.id}
              selected={image?.id === item.id}
            />
          ))}
        </div>
      }
    </>
  );
}
