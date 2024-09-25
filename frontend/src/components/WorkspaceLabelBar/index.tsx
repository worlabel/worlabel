import LabelButton from './LabelButton';
import useCanvasStore from '@/stores/useCanvasStore';

export default function WorkspaceLabelBar() {
  const { labels, image } = useCanvasStore();
  const selectedLabelId = useCanvasStore((state) => state.selectedLabelId);
  const setSelectedLabelId = useCanvasStore((state) => state.setSelectedLabelId);

  return (
    <div className="flex h-full w-[200px] flex-col justify-between gap-2 border-l border-gray-300 bg-gray-50 p-3">
      <div className="flex flex-col gap-2.5">
        <header className="subheading flex w-full items-center gap-2">
          <h1 className="w-full overflow-hidden text-ellipsis whitespace-nowrap">레이블 목록</h1>
        </header>
        <div className="flex flex-col gap-1">
          {image &&
            labels.map((label) => (
              <LabelButton
                key={label.id}
                {...label}
                selected={selectedLabelId === label.id}
                setSelectedLabelId={setSelectedLabelId}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
