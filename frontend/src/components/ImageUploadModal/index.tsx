import { useState } from 'react';
import CloseButton from './CloseButton';
import ProgressButton from './ProgressButton';
import FileList from './FileList';
import { uploadFiles } from '@/api/upload';

interface ImageUploadModalProps {
  title: string;
  buttonText: string;
  onClose: () => void;
}

export default function ImageUploadModal({ title, buttonText, onClose }: ImageUploadModalProps): JSX.Element {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFilesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      const newFiles = Array.from(fileList);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    if (fileList) {
      const newFiles = Array.from(fileList);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    setIsUploading(true);

    await uploadFiles(
      files,
      setUploadProgress,
      () => {
        setIsUploading(false);
        setUploadProgress(100);
        setTimeout(() => {
          setFiles([]);
          onClose();
        }, 2000);
      },
      (error: Error) => {
        console.error('Upload error:', error);
        setIsUploading(false);
      }
    );
  };

  const handleClose = () => {
    setFiles([]);
    onClose();
  };

  return (
    <div className="flex w-[610px] flex-col gap-10 rounded-3xl border px-10 py-5 shadow-lg">
      <header className="flex items-center justify-between">
        <h1 className="small-title">{title}</h1>
        <button
          className="flex h-8 w-8 items-center justify-center"
          onClick={handleClose}
        >
          <CloseButton className="self-end" />
        </button>
      </header>
      <div className="flex flex-col gap-5">
        <div className="flex justify-center">
          <div
            className="relative flex h-44 w-full max-w-[570px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-primary bg-gray-100 p-5 text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              multiple
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              onChange={handleFilesUpload}
            />
            <p className="font-sans text-base font-normal leading-relaxed text-gray-500">
              파일을 업로드하려면 클릭하거나
              <br />
              드래그하여 파일을 여기에 놓으세요
            </p>
          </div>
        </div>
        {files.length > 0 && (
          <div>
            <FileList
              files={files}
              onRemoveFile={(index) => setFiles(files.filter((_, i) => i !== index))}
            />
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <ProgressButton
          isActive={files.length > 0 && !isUploading}
          text={isUploading ? `업로드 중... (${uploadProgress}%)` : buttonText}
          onClick={handleUpload}
          progress={uploadProgress}
          type="submit"
          variant="outlinePrimary"
        />
      </div>
    </div>
  );
}
