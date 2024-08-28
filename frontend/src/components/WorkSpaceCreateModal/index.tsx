import WorkSpaceCreateForm, { WorkSpaceCreateFormValues } from './WorkSpaceCreateForm';
import XIcon from '@/assets/icons/x.svg?react';

export default function WorkSpaceCreateModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: WorkSpaceCreateFormValues) => void;
}) {
  return (
    <div className="flex w-[610px] flex-col gap-10 rounded-3xl border px-10 py-5 shadow-lg">
      <header className="flex gap-5">
        <h1 className="small-title w-full">새 워크스페이스</h1>
        <button
          className="flex h-8 w-8 items-center justify-center"
          onClick={onClose}
        >
          <XIcon className="stroke-gray-900" />
        </button>
      </header>
      <WorkSpaceCreateForm onSubmit={onSubmit} />
    </div>
  );
}
