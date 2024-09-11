import * as React from 'react';
import WorkSpaceCreateForm, { WorkSpaceCreateFormValues } from './WorkSpaceCreateForm';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { Plus } from 'lucide-react';

export default function WorkSpaceCreateModal({
  onSubmit,
}: {
  onSubmit: (data: { title: string; content: string }) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

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
        <WorkSpaceCreateForm
          onSubmit={(data: WorkSpaceCreateFormValues) => {
            const formattedData = {
              title: data.workspaceName,
              content: data.workspaceDescription || '',
            };
            onSubmit(formattedData);
            handleClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
