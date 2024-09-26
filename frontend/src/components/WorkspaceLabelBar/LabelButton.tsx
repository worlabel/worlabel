import { LABEL_CATEGORY } from '@/constants';
import useCanvasStore from '@/stores/useCanvasStore';
import { Label } from '@/types';
import { Trash2 } from 'lucide-react';
import { MouseEventHandler } from 'react';

export default function LabelButton({
  id,
  categoryId,
  color,
  selected,
  setSelectedLabelId,
}: Label & { selected: boolean; setSelectedLabelId: (id: number) => void }) {
  const { labels, setLabels } = useCanvasStore();
  const handleClick: MouseEventHandler = () => {
    console.log(`LabelButton ${id} clicked`);
    setSelectedLabelId(id);
  };
  const handleDelete: MouseEventHandler = (event) => {
    event.stopPropagation();
    console.log(`Delete LabelButton ${id}`);
    setLabels(labels.filter((label) => label.id !== id));
  };

  return (
    <div
      className={`flex items-center rounded-lg transition-colors ${selected ? 'bg-gray-200' : 'bg-gray-50 hover:bg-gray-100'}`}
    >
      <div
        className="flex grow cursor-pointer items-center gap-2.5 p-2.5 text-left"
        onClick={handleClick}
      >
        <div
          className="h-3 w-3 rounded-full"
          style={{
            backgroundColor: color,
          }}
        />
        <select
          className="body-small w-[97.2px] cursor-pointer rounded bg-transparent"
          value={categoryId.toString()}
          onChange={(event) => {
            const newCategoryId = Number(event.target.value);
            setLabels(labels.map((label) => (label.id === id ? { ...label, categoryId: newCategoryId } : label)));
          }}
        >
          {LABEL_CATEGORY.map((category, index) => (
            <option
              value={index.toString()}
              key={index}
            >
              {category}
            </option>
          ))}
        </select>
      </div>
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
