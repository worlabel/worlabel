import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { Plus } from 'lucide-react';
import ImageUploadPresingedForm from '@/components/ImageUploadPresignedModal/ImageUploadPresignedForm.tsx';

export default function ImageUploadPresignedModal({ projectId, folderId }: { projectId: number; folderId: number }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [fileCount, setFileCount] = React.useState<number>(0);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleFileCount = (fileCount: number) => {
    setFileCount(fileCount);
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
      <DialogContent className="max-w-2xl">
        <DialogHeader title={fileCount > 0 ? `파일 업로드 PreSigned (${fileCount})` : '파일 업로드 PreSigned'} />
        <ImageUploadPresingedForm
          onClose={handleClose}
          onFileCount={handleFileCount}
          projectId={projectId}
          folderId={folderId}
        />
      </DialogContent>
    </Dialog>
  );
}
