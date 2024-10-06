import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import useAuthStore from '@/stores/useAuthStore';
import { CircleCheckBig, CircleDashed, CircleX, X } from 'lucide-react';
import { FixedSizeList } from 'react-window';
import { UseMutationResult } from '@tanstack/react-query';
import { UploadZipParams, UploadFolderParams } from '@/types/uploadTypes';

interface UploadFormProps {
  onClose: () => void;
  onRefetch?: () => void;
  onFileCount: (fileCount: number) => void;
  projectId: number;
  folderId: number;
  isFolderUpload?: boolean;
  isZipUpload?: boolean;
  isFolderBackendUpload?: boolean;
  uploadImageZipMutation: UseMutationResult<unknown, Error, UploadZipParams, unknown>;
  uploadImageFolderFileMutation: UseMutationResult<unknown, Error, UploadFolderParams, unknown>;
  uploadImageFileMutation: UseMutationResult<unknown, Error, UploadFolderParams, unknown>;
  uploadImageFolderMutation: UseMutationResult<unknown, Error, UploadFolderParams, unknown>;
}

export default function ImageUploadForm({
  onClose,
  onRefetch,
  onFileCount,
  projectId,
  folderId,
  isFolderUpload = false,
  isZipUpload = false,
  isFolderBackendUpload = false,
  uploadImageZipMutation,
  uploadImageFolderFileMutation,
  uploadImageFileMutation,
  uploadImageFolderMutation,
}: UploadFormProps) {
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const [files, setFiles] = useState<File[]>([]);
  const [inputKey, setInputKey] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const handleClose = () => {
    onClose();
    setFiles([]);
    setInputKey((prevKey) => prevKey + 1);
    setIsUploading(false);
    setIsUploaded(false);
    setIsFailed(false);
    setProgress(0);
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

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const droppedItems = event.dataTransfer.items;

    if (droppedItems) {
      const allFiles: File[] = [];

      const traverseFileTree = async (item: FileSystemEntry) => {
        if (item.isFile) {
          const file = await new Promise<File>((resolve, reject) => {
            (item as FileSystemFileEntry).file(resolve, reject);
          });
          allFiles.push(file);
        } else if (item.isDirectory) {
          const directoryReader = (item as FileSystemDirectoryEntry).createReader();
          const readEntries = () =>
            new Promise<FileSystemEntry[]>((resolve, reject) => {
              directoryReader.readEntries(resolve, reject);
            });

          let entries = await readEntries();
          while (entries.length > 0) {
            for (const entry of entries) {
              await traverseFileTree(entry);
            }
            entries = await readEntries();
          }
        }
      };

      for (let i = 0; i < droppedItems.length; i++) {
        const item = droppedItems[i].webkitGetAsEntry();
        if (item) {
          await traverseFileTree(item);
        }
      }

      setFiles((prevFiles) => [...prevFiles, ...allFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    if (isFolderUpload) {
      setFiles([]);
      setInputKey((prevKey) => prevKey + 1);
    } else {
      setFiles(files.filter((_, i) => i !== index));
    }
  };

  const handleUpload = () => {
    if (files.length > 0) {
      setIsUploading(true);
      setIsUploaded(false);
      setIsFailed(false);

      const progressCallback = (progress: number) => {
        setProgress(progress);
      };

      if (isZipUpload) {
        const variables: UploadZipParams = {
          memberId,
          projectId,
          folderId,
          file: files[0],
          progressCallback,
        };
        uploadImageZipMutation.mutate(variables, {
          onSuccess: () => {
            handleRefetch();
            setIsUploaded(true);
          },
          onError: () => {
            setIsFailed(true);
          },
        });
      } else {
        const variables: UploadFolderParams = {
          memberId,
          projectId,
          folderId,
          files,
          progressCallback,
        };
        const mutation = isFolderBackendUpload
          ? uploadImageFolderMutation
          : isFolderUpload
            ? uploadImageFolderFileMutation
            : uploadImageFileMutation;

        mutation.mutate(variables, {
          onSuccess: () => {
            handleRefetch();
            setIsUploaded(true);
          },
          onError: () => {
            setIsFailed(true);
          },
        });
      }
    }
  };

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
            key={inputKey}
            type="file"
            {...(isFolderUpload ? { webkitdirectory: '' } : { multiple: !isZipUpload })}
            accept={isZipUpload ? '.zip' : undefined}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={handleChange}
          />
          {isDragging ? (
            <p className="text-primary">
              {isFolderUpload ? '드래그한 폴더를 여기에 놓으세요' : '드래그한 파일을 여기에 놓으세요'}
            </p>
          ) : (
            <p className="text-gray-500">
              {isFolderUpload
                ? '폴더를 업로드하려면 여기를 클릭하거나 폴더를 드래그하여 여기에 놓으세요'
                : '파일을 업로드하려면 여기를 클릭하거나 파일을 드래그하여 여기에 놓으세요'}
            </p>
          )}
        </div>
      )}
      {files.length > 0 && (
        <ul className="m-0 max-h-[260px] list-none overflow-y-auto p-0">
          <FixedSizeList
            height={260}
            itemCount={files.length}
            itemSize={40}
            width="100%"
          >
            {({ index, style }) => (
              <li
                key={index}
                className="flex items-center justify-between p-1"
                style={style}
              >
                <span className="truncate">{files[index].webkitRelativePath || files[index].name}</span>
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
                    className="cursor-pointer p-2"
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
            )}
          </FixedSizeList>
        </ul>
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
