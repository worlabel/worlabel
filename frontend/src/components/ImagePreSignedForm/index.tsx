import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import useAuthStore from '@/stores/useAuthStore';
import { CircleCheckBig, CircleDashed, CircleX, X } from 'lucide-react';
import { FixedSizeList } from 'react-window';
import useUploadFiles from '@/hooks/useUploadFiles';
import useUploadImagePresignedQuery from '@/queries/images/useUploadImagePresignedQuery';
import { unzipFilesWithPath, extractFilesRecursivelyWithPath } from '@/utils/fileUtils';

interface ImagePreSignedFormProps {
  onClose: () => void;
  onRefetch?: () => void;
  onFileCount: (fileCount: number) => void;
  projectId: number;
  folderId: number;
  uploadType: 'file' | 'folder' | 'zip';
}

export default function ImagePreSignedForm({
  onClose,
  onRefetch,
  onFileCount,
  projectId,
  folderId,
  uploadType,
}: ImagePreSignedFormProps) {
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const [files, setFiles] = useState<{ path: string; file: File }[]>([]);
  const [inputKey, setInputKey] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<(boolean | null)[]>([]);

  // Ensure to destructure the uploadFiles function properly from the hook
  const { uploadFiles } = useUploadFiles();
  const uploadImageFile = useUploadImagePresignedQuery();
  const handleClose = () => {
    onClose();
    setFiles([]);
    setInputKey((prevKey) => prevKey + 1);
    setIsUploading(false);
    setIsUploaded(false);
    setIsFailed(false);
    setProgress(0);
    setUploadStatus([]);
  };

  const handleRefetch = () => {
    if (onRefetch) {
      onRefetch();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;

    if (newFiles) {
      const processedFiles: { path: string; file: File }[] = [];

      for (const file of Array.from(newFiles)) {
        const path = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
        processedFiles.push({ path, file });
      }

      setFiles((prevFiles) => [...prevFiles, ...processedFiles]);
      setUploadStatus((prevStatus) => [...prevStatus, ...processedFiles.map(() => null)]);
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

    if (uploadType === 'folder') {
      const droppedItems = event.dataTransfer.items;
      let processedFiles: { path: string; file: File }[] = [];

      for (let i = 0; i < droppedItems.length; i++) {
        const item = droppedItems[i];
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            const filesFromEntry = await extractFilesRecursivelyWithPath(entry, entry.name);
            processedFiles = [...processedFiles, ...filesFromEntry];
          }
        }
      }

      setFiles((prevFiles) => [...prevFiles, ...processedFiles]);
      setUploadStatus((prevStatus) => [...prevStatus, ...processedFiles.map(() => null)]);
    } else {
      const droppedFiles = event.dataTransfer.files;
      if (droppedFiles) {
        const processedFiles: { path: string; file: File }[] = [];
        for (const file of Array.from(droppedFiles)) {
          processedFiles.push({ path: file.name, file });
        }
        setFiles((prevFiles) => [...prevFiles, ...processedFiles]);
        setUploadStatus((prevStatus) => [...prevStatus, ...processedFiles.map(() => null)]);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setUploadStatus((prevStatus) => prevStatus.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length > 0) {
      setIsUploading(true);
      setIsUploaded(false);
      setIsFailed(false);

      let finalFiles: { path: string; file: File }[] = [];

      for (const file of files) {
        if (file.file.type === 'application/zip' || file.file.type === 'application/x-zip-compressed') {
          console.log('업로드 전에 ZIP 파일 해제:', file.file.name);
          const unzippedFiles = await unzipFilesWithPath(file.file);
          console.log('해제된 파일:', unzippedFiles);
          finalFiles = [...finalFiles, ...unzippedFiles];
        } else {
          finalFiles.push(file);
        }
      }

      if (uploadType === 'file') {
        uploadImageFile.mutate(
          {
            memberId,
            projectId,
            folderId,
            files: finalFiles.map(({ file }) => file), // Extract only the file
            progressCallback: (index: number) => {
              setUploadStatus((prevStatus) => {
                const newStatus = [...prevStatus];
                newStatus[index] = true; // Mark as uploaded
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
              setUploadStatus((prevStatus) => prevStatus.map((status) => (status === null ? false : status)));
            },
          }
        );
      } else {
        try {
          await uploadFiles({
            files: finalFiles, // Pass the files with path and file
            projectId,
            folderId,
            memberId,
            onProgress: (progressValue: number) => {
              setProgress(progressValue);
            },
          });

          setUploadStatus(finalFiles.map(() => true));
          setIsUploaded(true);
          handleRefetch();
        } catch (error) {
          setIsFailed(true);
          setUploadStatus(finalFiles.map(() => false));
          console.error('업로드 실패:', error);
        }
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
            webkitdirectory={uploadType === 'folder' ? '' : undefined}
            multiple={uploadType !== 'zip'}
            accept={uploadType === 'zip' ? '.zip' : uploadType === 'file' ? '.jpg,.jpeg,.png' : undefined}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={handleChange}
          />
          {isDragging ? (
            <p className="text-primary">
              {uploadType === 'folder' ? '드래그한 폴더를 여기에 놓으세요' : '드래그한 파일을 여기에 놓으세요'}
            </p>
          ) : (
            <p className="text-gray-500">
              {uploadType === 'folder'
                ? '폴더를 업로드하려면 여기를 클릭하거나 폴더를 드래그하여 여기에 놓으세요'
                : uploadType === 'zip'
                  ? 'ZIP 파일을 업로드하려면 여기를 클릭하거나 ZIP 파일을 드래그하여 여기에 놓으세요'
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
                <span className="truncate">{files[index].path}</span>
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
