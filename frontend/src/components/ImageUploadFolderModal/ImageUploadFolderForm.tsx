import { useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import useAuthStore from '@/stores/useAuthStore';
import { CircleCheckBig, CircleDashed, CircleX, X } from 'lucide-react';
import useUploadImageFolderQuery from '@/queries/projects/useUploadImageFolderQuery';

export default function ImageUploadFolderForm({
  onClose,
  projectId,
  folderId,
}: {
  onClose: () => void;
  projectId: number;
  folderId: number;
}) {
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const uploadImageFolder = useUploadImageFolderQuery();

  const handleClose = () => {
    onClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;

    if (newFiles) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(newFiles)]);
    }

    event.target.value = '';
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

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i != index));
  };

  const handleUpload = async () => {
    setIsUploading(true);

    uploadImageFolder.mutate(
      {
        memberId,
        projectId,
        folderId,
        files,
        progressCallback: (progress: number) => {
          setProgress(progress);
        },
      },
      {
        onSuccess: () => {
          setIsUploaded(true);
        },
        onError: () => {
          setIsFailed(true);
        },
      }
    );
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
        <ul className="m-0 max-h-[260px] list-none overflow-y-auto p-0">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-1"
            >
              <span className="truncate">{file.webkitRelativePath || file.name}</span>
              {isUploading ? (
                <div className="p-2">
                  {isUploaded ? (
                    <CircleCheckBig
                      className="stroke-green-500"
                      size={16}
                      strokeWidth="2"
                    />
                  ) : isFailed ? (
                    <CircleX
                      className="stroke-red-500"
                      size={16}
                      strokeWidth="2"
                    />
                  ) : (
                    <CircleDashed
                      className="stroke-gray-500"
                      size={16}
                      strokeWidth="2"
                    />
                  )}
                </div>
              ) : (
                <button
                  className={'cursor-pointer p-2'}
                  onClick={() => handleRemoveFile(index)}
                >
                  <X
                    color="red"
                    size={16}
                    strokeWidth="2"
                  />
                </button>
              )}
            </li>
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
          disabled={!isUploaded && !isFailed}
        >
          {isFailed ? '업로드 실패 (닫기)' : isUploaded ? '업로드 완료 (닫기)' : `업로드 중... ${progress}%`}
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
