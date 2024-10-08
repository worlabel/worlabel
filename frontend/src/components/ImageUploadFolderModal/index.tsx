import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { Plus } from 'lucide-react';
import ImageUploadFolderForm from './ImageUploadFolderForm';

export default function ImageUploadFolderModal({ projectId, folderId }: { projectId: number; folderId: number }) {
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
      <DialogContent className="max-w-2xl">
        <DialogHeader title="폴더 업로드 (백엔드 구현 필요)" />
        <ImageUploadFolderForm
          onClose={handleClose}
          projectId={projectId}
          folderId={folderId}
        />
      </DialogContent>
    </Dialog>
  );
}
