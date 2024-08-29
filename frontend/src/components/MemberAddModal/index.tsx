import MemberAddForm, { MemberAddFormValues } from './MemberAddForm';
import XIcon from '@/assets/icons/x.svg?react';

export default function MemberAddModal({
  title = '새 멤버 초대',
  onClose,
  onSubmit,
}: {
  title?: string;
  onClose: () => void;
  onSubmit: (data: MemberAddFormValues) => void;
}) {
  return (
    <div className="flex w-[610px] flex-col gap-10 rounded-3xl border px-10 py-5 shadow-lg">
      <header className="flex gap-5">
        <h1 className="small-title w-full">{title}</h1>
        <button
          className="flex h-8 w-8 items-center justify-center"
          onClick={onClose}
        >
          <XIcon className="stroke-gray-900" />
        </button>
      </header>
      <MemberAddForm onSubmit={onSubmit} />
    </div>
  );
}
