import { useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { uploadImageFolder } from '@/api/imageApi';
import useAuthStore from '@/stores/useAuthStore';

export default function ImageFolderUploadForm({
  onClose,
  projectId,
  parentId,
}: {
  onClose: () => void;
  projectId: number;
  parentId: number;
}) {
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isFailed, setIsFailed] = useState<boolean>(false);

  const handleClose = () => {
    onClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;

    if (newFiles) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(newFiles)]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = () => {
    setIsDragging(false);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setProgress(0);

    await uploadImageFolder(memberId, projectId, files, parentId)
      .then(() => {
        setProgress(100);
      })
      .catch(() => {
        setProgress(100);
        setIsFailed(true);
      });
  };

  return (
    <div className="flex flex-col gap-5">
      {!isUploading && (
        <div
          className={cn(
            'relative flex h-[200px] w-full cursor-pointer items-center justify-center rounded-lg border-2 text-center',
            isDragging ? 'border-solid border-primary bg-blue-200' : 'border-dashed border-gray-500 bg-gray-100'
          )}
        >
          <input
            type="file"
            webkitdirectory=""
            // multiple
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={handleChange}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
          {isDragging ? (
            <p className="text-primary">드래그한 폴더를 여기에 놓으세요</p>
          ) : (
            <p className="text-gray-500">
              폴더를 업로드하려면 여기를 클릭하거나
              <br />
              폴더를 드래그하여 여기에 놓으세요
            </p>
          )}
        </div>
      )}
      {files.length > 0 && (
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file.webkitRelativePath || file.name}</li>
          ))}
        </ul>
      )}
      {isUploading ? (
        <Button
          onClick={handleClose}
          variant="outlinePrimary"
          className={
            isFailed
              ? 'border-red-500 text-red-500 hover:bg-red-500 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500'
              : ''
          }
          disabled={progress != 100}
        >
          {progress === 100 ? (isFailed ? '업로드 실패 (닫기)' : '업로드 완료 (닫기)') : `업로드 중... ${progress}%`}
        </Button>
      ) : (
        <Button
          onClick={handleUpload}
          variant="outlinePrimary"
          disabled={files.length === 0}
        >
          업로드
        </Button>
      )}
    </div>
  );
}
