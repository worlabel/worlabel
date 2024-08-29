import { Label } from '@/types';
import { Edit, Trash2 } from 'lucide-react';
import { MouseEventHandler } from 'react';

export default function LabelButton({ id, name, color }: Label) {
  const handleClick: MouseEventHandler = () => {
    console.log(`LabelButton ${id} clicked`);
  };
  const handleEdit: MouseEventHandler = (event) => {
    event.stopPropagation();
    console.log(`Edit LabelButton ${id}`);
  };
  const handleDelete: MouseEventHandler = (event) => {
    event.stopPropagation();
    console.log(`Delete LabelButton ${id}`);
  };

  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-gray-100 p-2.5 transition-colors hover:bg-gray-200">
      <button
        className="flex grow items-center gap-2.5 text-left"
        onClick={handleClick}
      >
        <div
          className="h-3 w-3 rounded-full"
          style={{
            backgroundColor: color,
          }}
        />
        <span className="body grow text-gray-900">{name}</span>
      </button>
      <button onClick={handleEdit}>
        <Edit
          size={16}
          className="stroke-gray-500 hover:stroke-gray-600"
        />
      </button>
      <button onClick={handleDelete}>
        <Trash2
          size={16}
          className="stroke-red-500 hover:stroke-red-600"
        />
      </button>
    </div>
  );
}
