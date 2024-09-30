import React from 'react';
import MemberAddForm, { MemberAddFormValues } from './MemberAddForm';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import useAddWorkspaceMemberQuery from '@/queries/workspaces/useAddWorkspaceMemberQuery';

interface WorkspaceMemberAddModalProps {
  workspaceId: number;
  memberId: number;
  buttonClass?: string;
}

export default function WorkspaceMemberAddModal({
  workspaceId,
  memberId,
  buttonClass = '',
}: WorkspaceMemberAddModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const addWorkspaceMemberMutation = useAddWorkspaceMemberQuery();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmit = (data: MemberAddFormValues) => {
    addWorkspaceMemberMutation.mutate({
      workspaceId,
      memberId,
      newMemberId: data.memberId,
    });
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="blue"
          className={`${buttonClass}`}
          onClick={handleOpen}
        >
          <Plus size={16} />
          <span>워크스페이스 멤버 초대하기</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader title="새 워크스페이스 멤버 초대" />
        <MemberAddForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
