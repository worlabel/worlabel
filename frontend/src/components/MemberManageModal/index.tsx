import MemberManageForm, { MemberManageFormValues } from './MemberManageForm';
import XIcon from '@/assets/icons/x.svg?react';

type Role = 'admin' | 'editor' | 'viewer';

interface Member {
  email: string;
  role: Role;
}

export default function MemberManageModal({
  title = '멤버 관리',
  onClose,
  onSubmit,
  members,
}: {
  title?: string;
  onClose: () => void;
  onSubmit: (data: MemberManageFormValues) => void;
  members: Member[];
}) {
  return (
    <div className="flex w-[610px] flex-col gap-10 rounded-3xl border px-10 py-5 shadow-lg">
      <header className="flex w-full items-center gap-5">
        <h1 className="small-title flex-1">{title}</h1>
        <button
          className="flex h-8 w-8 items-center justify-center"
          onClick={onClose}
        >
          <XIcon className="stroke-gray-900" />
        </button>
      </header>
      <MemberManageForm
        onSubmit={onSubmit}
        members={members}
      />
    </div>
  );
}
