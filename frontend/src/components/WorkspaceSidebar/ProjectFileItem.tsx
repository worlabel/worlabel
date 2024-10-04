import { cn } from '@/lib/utils';
import { ImageResponse } from '@/types';
import { Image } from 'lucide-react';
import useCanvasStore from '@/stores/useCanvasStore';
import MemoFileStatusIcon from './FileStatusIcon';

export default function ProjectFileItem({
  className = '',
  item,
  depth = 0,
  selected,
}: {
  className?: string;
  item: ImageResponse;
  folderId?: number;
  depth?: number;
  selected: boolean;
}) {
  const paddingLeft = depth * 12;
  const setImage = useCanvasStore((state) => state.setImage);

  const handleClick = () => {
    setImage(item);
  };

  return (
    <button
      className={cn(
        `flex w-full items-center gap-2 rounded-md py-0.5 pr-1 ${selected ? 'bg-gray-200' : 'hover:bg-gray-100'}`,
        className
      )}
      style={{
        paddingLeft,
      }}
      onClick={handleClick}
    >
      <div className="flex items-center">
        <Image
          size={16}
          className="stroke-gray-500"
        />
      </div>
      <span className="grow overflow-hidden text-ellipsis whitespace-nowrap text-left">{item.imageTitle}</span>
      <MemoFileStatusIcon imageStatus={item.status} />
    </button>
  );
}
