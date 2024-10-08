import WorkSpaceCreateForm, { WorkSpaceCreateFormValues } from './WorkSpaceCreateForm';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { Plus } from 'lucide-react';
import { WorkspaceRequest } from '@/types';
import { useState } from 'react';

interface WorkSpaceCreateModalProps {
  onSubmit: (data: WorkspaceRequest) => void;
}

export default function WorkSpaceCreateModal({ onSubmit }: WorkSpaceCreateModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFormSubmit = (data: WorkSpaceCreateFormValues) => {
    const formattedData: WorkspaceRequest = {
      title: data.workspaceName,
      content: data.workspaceDescription || '',
    };
    onSubmit(formattedData);
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <button
          className="flex items-center justify-center p-2"
          onClick={() => setIsOpen(true)}
        >
          <Plus size={20} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader title="새 워크스페이스 추가" />
        <WorkSpaceCreateForm onSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  );
}
