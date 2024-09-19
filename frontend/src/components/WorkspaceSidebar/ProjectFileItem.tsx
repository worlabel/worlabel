import { cn } from '@/lib/utils';
import { ImageResponse } from '@/types';
import { Check, Image, Minus } from 'lucide-react';
import useCanvasStore from '@/stores/useCanvasStore';

export default function ProjectFileItem({
  className = '',
  item,
  depth = 1,
  selected,
}: {
  className?: string;
  item: ImageResponse;
  depth?: number;
  selected: boolean;
}) {
  const paddingLeft = depth * 12;
  const changeImage = useCanvasStore((state) => state.changeImage);

  const handleClick = () => {
    // TODO: fetch image
    changeImage(item.imageUrl, [
      {
        id: item.id,
        name: item.imageTitle,
        type: 'rect',
        color: '#FF0000',
        coordinates: [
          [0, 0],
          [100, 100],
        ],
      },
    ]);
  };

  return (
    <button
      className={cn(
        `flex w-full gap-2 rounded-md py-0.5 pr-1 ${selected ? 'bg-gray-200' : 'hover:bg-gray-100'}`,
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
      {item.status === 'COMPLETED' ? (
        <Check
          size={16}
          className="shrink-0 stroke-green-500"
        />
      ) : (
        <Minus
          size={16}
          className="shrink-0 stroke-gray-400"
        />
      )}
    </button>
  );
}
