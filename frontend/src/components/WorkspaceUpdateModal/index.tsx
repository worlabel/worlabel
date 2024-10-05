import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { Plus } from 'lucide-react';
import { WorkspaceRequest, WorkspaceResponse } from '@/types';
import { useState } from 'react';
import WorkspaceUpdateForm, { WorkspaceUpdateFormValues } from './WorkspaceUpdateForm';

interface WorkspaceUpdateModalProps {
  workspace: WorkspaceResponse;
  onSubmit: (data: WorkspaceRequest) => void;
}

export default function WorkspaceUpdateModal({ workspace, onSubmit }: WorkspaceUpdateModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFormSubmit = (data: WorkspaceUpdateFormValues) => {
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
        <DialogHeader title="워크스페이스 이름 변경" />
        <WorkspaceUpdateForm
          workspace={workspace}
          onSubmit={handleFormSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
