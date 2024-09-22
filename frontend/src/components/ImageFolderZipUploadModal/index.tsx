import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { Plus } from 'lucide-react';
import ImageFolderZipUploadForm from './ImageFolderZipUploadForm';

export default function ImageFolderZipUploadModal({
  projectId,
  parentId = 0,
}: {
  projectId: number;
  parentId: number;
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
      <DialogContent className="max-w-2xl">
        <DialogHeader title="폴더 압축파일 업로드" />
        <ImageFolderZipUploadForm
          onClose={handleClose}
          projectId={projectId}
          parentId={parentId}
        />
      </DialogContent>
    </Dialog>
  );
}
