import { Label } from '@/types';
import LabelButton from './LabelButton';
import { Button } from '../ui/button';
import { Play } from 'lucide-react';

export default function WorkspaceLabelBar({ labels }: { labels: Label[] }) {
  const handleAutoLabeling = () => {
    console.log('Auto labeling');
  };

  return (
    <div className="flex h-full w-[280px] flex-col justify-between border-l border-gray-300 bg-gray-100">
      <div className="flex flex-col gap-2.5">
        <header className="subheading flex w-full items-center gap-2 px-5 py-2.5">
          <h1 className="w-full overflow-hidden text-ellipsis whitespace-nowrap">레이블 목록</h1>
        </header>
        <div className="flex flex-col gap-1 px-2.5">
          {labels.map((label) => (
            <LabelButton
              key={label.id}
              {...label}
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
