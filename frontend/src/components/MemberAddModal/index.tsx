import React from 'react';
import MemberAddForm, { MemberAddFormValues } from './MemberAddForm';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface MemberAddModalProps {
  onSubmit: (data: MemberAddFormValues) => void;
  buttonClass?: string;
}

export default function MemberAddModal({ onSubmit, buttonClass = '' }: MemberAddModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="outlinePrimary"
          className={`${buttonClass}`}
          onClick={handleOpen}
        >
          <Plus size={16} />
          <span>멤버 초대하기</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader title="새 멤버 초대" />
        <MemberAddForm
          onSubmit={(data: MemberAddFormValues) => {
            onSubmit(data);
            handleClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
