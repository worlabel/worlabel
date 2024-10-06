import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import useAuthStore from '@/stores/useAuthStore';
import { CircleCheckBig, CircleDashed, CircleX, X } from 'lucide-react';
import useUploadImagePresignedQuery from '@/queries/images/useUploadImagePresignedQuery';

export default function ImageUploadPresignedForm({
  onClose,
  onRefetch,
  onFileCount,
  projectId,
  folderId,
}: {
  onClose: () => void;
  onRefetch?: () => void;
  onFileCount: (fileCount: number) => void;
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
  const [uploadStatus, setUploadStatus] = useState<(boolean | null)[]>([]);

  const uploadImageFile = useUploadImagePresignedQuery();

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
      const newImages = Array.from(newFiles).filter((file) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase() ?? '';
        return ['jpg', 'png', 'jpeg'].includes(fileExtension);
      });

      setFiles((prevFiles) => [...prevFiles, ...newImages]);
      setUploadStatus((prevState) => [...prevState, ...newImages.map(() => null)]);
    }

    event.target.value = '';
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);

    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles) {
      const newImages = Array.from(droppedFiles).filter((file) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase() ?? '';
        return ['jpg', 'png', 'jpeg'].includes(fileExtension);
      });

      setFiles((prevFiles) => [...prevFiles, ...newImages]);
      setUploadStatus((prevState) => [...prevState, ...newImages.map(() => null)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setUploadStatus((prevState) => prevState.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setIsUploading(true);

    uploadImageFile.mutate(
      {
        memberId,
        projectId,
        folderId,
        files,
        progressCallback: (index: number) => {
          setUploadStatus((prevStatus) => {
            const newStatus = [...prevStatus];
            newStatus[index] = true; // 업로드 성공 시 true
            return newStatus;
          });
        },
      },
      {
        onSuccess: () => {
          handleRefetch();
          setIsUploaded(true);
        },
        onError: () => {
          setIsFailed(true);
          setUploadStatus((prevStatus) => prevStatus.map((status) => (status === null ? false : status))); // 실패 시 처리
        },
      }
    );
  };

  // 전체 진행 상황 계산
  const totalProgress = Math.round((uploadStatus.filter((status) => status !== null).length / files.length) * 100);

  useEffect(() => {
    onFileCount(files.length);
  }, [files, onFileCount]);

  return (
    <div className="flex flex-col gap-5">
      {!isUploading && (
        <div
          className={cn(
            'relative flex h-[200px] w-full cursor-pointer items-center justify-center rounded-lg border-2 text-center',
            isDragging ? 'border-solid border-primary bg-blue-200' : 'border-dashed border-gray-500 bg-gray-100'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            // webkitdirectory=""
            multiple
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={handleChange}
          />
          {isDragging ? (
            <p className="text-primary">드래그한 파일을 여기에 놓으세요</p>
          ) : (
            <p className="text-gray-500">
              파일을 업로드하려면 여기를 클릭하거나
              <br />
              파일을 드래그하여 여기에 놓으세요
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
              <span className="truncate">{file.name}</span>
              {isUploading ? (
                <div className="p-2">
                  {uploadStatus[index] === true ? (
                    <CircleCheckBig
                      className="stroke-green-500"
                      size={16}
                      strokeWidth="2"
                    />
                  ) : uploadStatus[index] === false ? (
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
          variant={isFailed ? 'red' : 'blue'}
        >
          {isFailed
            ? '업로드 실패 (닫기)'
            : isUploaded
              ? '업로드 완료 (닫기)'
              : totalProgress === 0
                ? '업로드 준비 중...'
                : `업로드 중... ${totalProgress}%`}
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
