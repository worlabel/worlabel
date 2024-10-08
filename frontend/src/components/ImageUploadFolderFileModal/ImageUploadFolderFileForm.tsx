import { useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import useAuthStore from '@/stores/useAuthStore';
import { CircleCheckBig, CircleDashed, CircleX, X } from 'lucide-react';
import useUploadImageFolderFileQuery from '@/queries/projects/useUploadImageFolderFileQuery';

export default function ImageUploadFolderFileForm({
  onClose,
  onRefetch,
  projectId,
  folderId,
}: {
  onClose: () => void;
  onRefetch?: () => void;
  projectId: number;
  folderId: number;
}) {
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const [files, setFiles] = useState<File[]>([]);
  const [inputKey, setInputKey] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const uploadImageFolderFile = useUploadImageFolderFileQuery();

  const handleClose = () => {
    onClose();
  };

  const handleRefetch = () => {
    if (onRefetch) {
      onRefetch();
    }
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

  const handleRemoveFile = () => {
    setFiles([]);
    setInputKey((prevKey) => prevKey + 1);
  };

  const handleUpload = async () => {
    setIsUploading(true);

    uploadImageFolderFile.mutate(
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
          handleRefetch();
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
            key={inputKey}
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
        <div className={'flex items-center justify-between p-1'}>
          <span className="truncate">
            {files[0].webkitRelativePath.substring(0, files[0].webkitRelativePath.indexOf('/'))} {}
          </span>
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
              onClick={handleRemoveFile}
            >
              <X
                color="red"
                size={16}
                strokeWidth="2"
              />
            </button>
          )}
        </div>
      )}
      {isUploading ? (
        <Button
          onClick={handleClose}
          variant={isFailed ? 'red' : 'blue'}
          disabled={!isUploaded && !isFailed}
        >
          {isFailed ? '업로드 실패 (닫기)' : isUploaded ? '업로드 완료 (닫기)' : `업로드 중... ${progress}%`}
        </Button>
      ) : (
        <Button
          onClick={handleUpload}
          variant="blue"
          disabled={files.length === 0}
        >
          업로드
        </Button>
      )}
    </div>
  );
}
