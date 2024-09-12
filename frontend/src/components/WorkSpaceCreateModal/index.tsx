import * as React from 'react';
import WorkSpaceCreateForm, { WorkSpaceCreateFormValues } from './WorkSpaceCreateForm';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { Plus } from 'lucide-react';
import { WorkspaceRequestDTO } from '@/types';

interface WorkSpaceCreateModalProps {
  onSubmit: (data: WorkspaceRequestDTO) => void;
}

export default function WorkSpaceCreateModal({ onSubmit }: WorkSpaceCreateModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleFormSubmit = (data: WorkSpaceCreateFormValues) => {
    const formattedData: WorkspaceRequestDTO = {
      title: data.workspaceName,
      content: data.workspaceDescription || '',
    };
    onSubmit(formattedData);
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <button
          className="flex items-center justify-center p-2"
          onClick={handleOpen}
        >
          <Plus size={20} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader title="새 워크스페이스" />
        <WorkSpaceCreateForm onSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  );
}
