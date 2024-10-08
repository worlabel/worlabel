import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { Plus } from 'lucide-react';
import ImageUploadForm from './ImageUploadForm';
import useUploadImageFileQuery from '@/queries/projects/useUploadImageFileQuery';
import useUploadImageFolderFileQuery from '@/queries/projects/useUploadImageFolderFileQuery';
import useUploadImageZipQuery from '@/queries/projects/useUploadImageZipQuery';
import useUploadImageFolderQuery from '@/queries/projects/useUploadImageFolderQuery';

interface ImageUploadModalProps {
  projectId: number;
  folderId: number;
  isFolderUpload?: boolean;
  isZipUpload?: boolean;
  isFolderBackendUpload?: boolean;
}

export default function ImageUploadModal({
  projectId,
  folderId,
  isFolderUpload = false,
  isZipUpload = false,
  isFolderBackendUpload = false,
}: ImageUploadModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [fileCount, setFileCount] = React.useState<number>(0);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleFileCount = (fileCount: number) => {
    setFileCount(fileCount);
  };

  const uploadImageZipMutation = useUploadImageZipQuery();
  const uploadImageFolderFileMutation = useUploadImageFolderFileQuery();
  const uploadImageFileMutation = useUploadImageFileQuery();
  const uploadImageFolderMutation = useUploadImageFolderQuery();

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
        <DialogHeader title={fileCount > 0 ? `파일 업로드 (${fileCount})` : '파일 업로드'} />
        <ImageUploadForm
          onClose={handleClose}
          onFileCount={handleFileCount}
          projectId={projectId}
          folderId={folderId}
          isFolderUpload={isFolderUpload}
          isZipUpload={isZipUpload}
          isFolderBackendUpload={isFolderBackendUpload}
          uploadImageZipMutation={uploadImageZipMutation}
          uploadImageFolderFileMutation={uploadImageFolderFileMutation}
          uploadImageFileMutation={uploadImageFileMutation}
          uploadImageFolderMutation={uploadImageFolderMutation}
        />
      </DialogContent>
    </Dialog>
  );
}
