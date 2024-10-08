import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { Plus } from 'lucide-react';
import ImageUploadFolderFileForm from './ImageUploadFolderFileForm';

export default function ImageUploadFolderFileModal({ projectId, folderId }: { projectId: number; folderId: number }) {
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
        <DialogHeader title="폴더 업로드 (파일 업로드 API 이용)" />
        <ImageUploadFolderFileForm
          onClose={handleClose}
          projectId={projectId}
          folderId={folderId}
        />
      </DialogContent>
    </Dialog>
  );
}
