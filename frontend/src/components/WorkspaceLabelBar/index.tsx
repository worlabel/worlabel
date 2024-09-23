import LabelButton from './LabelButton';
import { Button } from '../ui/button';
import { Play } from 'lucide-react';
import useCanvasStore from '@/stores/useCanvasStore';

export default function WorkspaceLabelBar() {
  const labels = useCanvasStore((state) => state.labels);
  const selectedLabelId = useCanvasStore((state) => state.selectedLabelId);
  const setSelectedLabelId = useCanvasStore((state) => state.setSelectedLabelId);
  const handleAutoLabeling = () => {
    console.log('Auto labeling');
  };

  return (
    <div className="flex h-full w-[280px] flex-col justify-between gap-2 border-l border-gray-300 bg-gray-50 p-3">
      <div className="flex flex-col gap-2.5">
        <header className="subheading flex w-full items-center gap-2">
          <h1 className="w-full overflow-hidden text-ellipsis whitespace-nowrap">레이블 목록</h1>
        </header>
        <div className="flex flex-col gap-1">
          {labels.map((label) => (
            <LabelButton
              key={label.id}
              {...label}
              selected={selectedLabelId === label.id}
              setSelectedLabelId={setSelectedLabelId}
            />
          ))}
        </div>
      </div>
      <div className="flex p-2.5">
        <Button
          variant="outlinePrimary"
          className="w-full"
          onClick={handleAutoLabeling}
        >
          <Play
            size={16}
            className="mr-1"
          />
          <span>자동 레이블링</span>
        </Button>
      </div>
    </div>
  );
}
