import { Label } from '@/types';
import { Trash2 } from 'lucide-react';
import { MouseEventHandler } from 'react';

export default function LabelButton({
  id,
  name,
  color,
  selected,
  setSelectedLabelId,
}: Label & { selected: boolean; setSelectedLabelId: (id: number) => void }) {
  const handleClick: MouseEventHandler = () => {
    console.log(`LabelButton ${id} clicked`);
    setSelectedLabelId(id);
  };
  const handleDelete: MouseEventHandler = (event) => {
    event.stopPropagation();
    console.log(`Delete LabelButton ${id}`);
  };

  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg transition-colors ${selected ? 'bg-gray-200' : 'bg-gray-50 hover:bg-gray-100'}`}
    >
      <button
        className="flex grow items-center gap-2.5 p-2.5 text-left"
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
      <button
        className="p-2.5"
        onClick={handleDelete}
      >
        <Trash2
          size={16}
          className="stroke-red-500 hover:stroke-red-600"
        />
      </button>
    </div>
  );
}
