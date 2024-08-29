import { cn } from '@/lib/utils';
import { FileItem } from '@/types';
import { Check, Image, Minus } from 'lucide-react';

export default function ProjectFileItem({
  className = '',
  item,
  depth = 1,
}: {
  className?: string;
  item: FileItem;
  depth?: number;
}) {
  const paddingLeft = depth * 12;

  return (
    <button
      className={cn('flex w-full gap-2 rounded-md py-0.5 pr-1 hover:bg-gray-200', className)}
      style={{
        paddingLeft,
      }}
    >
      <div className="flex items-center">
        <Image
          size={16}
          className="stroke-gray-500"
        />
      </div>
      <span className="grow overflow-hidden text-ellipsis whitespace-nowrap text-left">{item.name}</span>
      {item.status === 'idle' ? (
        <Minus
          size={16}
          className="shrink-0 stroke-gray-400"
        />
      ) : (
        <Check
          size={16}
          className="shrink-0 stroke-green-500"
        />
      )}
    </button>
  );
}
