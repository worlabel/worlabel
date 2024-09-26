import { cn } from '@/lib/utils';
import { ImageResponse } from '@/types';
import { ArrowDownToLine, Check, Image, Loader, Minus, Send } from 'lucide-react';
import useCanvasStore from '@/stores/useCanvasStore';

export default function ProjectFileItem({
  className = '',
  item,
  depth = 0,
  selected,
}: {
  className?: string;
  item: ImageResponse;
  depth?: number;
  selected: boolean;
}) {
  const paddingLeft = depth * 12;
  // const changeImage = useCanvasStore((state) => state.changeImage);
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
      {item.status === 'PENDING' ? (
        <Minus
          size={12}
          className="shrink-0 stroke-gray-400"
        />
      ) : item.status === 'IN_PROGRESS' ? (
        <Loader
          size={12}
          className="shrink-0 stroke-yellow-500"
        />
      ) : item.status === 'SAVE' ? (
        <ArrowDownToLine
          size={12}
          className="shrink-0 stroke-gray-400"
        />
      ) : item.status === 'REVIEW_REQUEST' ? (
        <Send
          size={12}
          className="shrink-0 stroke-blue-400"
        />
      ) : (
        <Check
          size={12}
          className="shrink-0 stroke-green-500"
        />
      )}
    </button>
  );
}
