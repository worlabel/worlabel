import React from 'react';
import MemberAddForm, { MemberAddFormValues } from './MemberAddForm';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { Button } from '@/components/ui/button';
import useAddProjectMemberQuery from '@/queries/projects/useAddProjectMemberQuery';
import { ProjectMemberRequest } from '@/types';

interface MemberAddModalProps {
  projectId: number;
  buttonClass?: string;
}

export default function MemberAddModal({ projectId, buttonClass = '' }: MemberAddModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { mutate: addProjectMember } = useAddProjectMemberQuery();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleMemberAdd = (data: MemberAddFormValues) => {
    const newMember: ProjectMemberRequest = {
      memberId: data.memberId,
      privilegeType: data.role,
    };
    addProjectMember({
      projectId,
      memberId: data.memberId,
      newMember,
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
          className={buttonClass}
          onClick={handleOpen}
        >
          <span>프로젝트에 새 멤버 초대</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader title="프로젝트에 새 멤버 초대" />
        <MemberAddForm onSubmit={handleMemberAdd} />
      </DialogContent>
    </Dialog>
  );
}
