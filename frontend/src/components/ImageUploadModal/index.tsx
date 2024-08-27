import { useState } from 'react';
import CloseButton from './CloseButton';
import Button from './Button';
import FileList from './FileList';
import axios, { AxiosProgressEvent } from 'axios';

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
    // 개발 중 알림
    alert('파일 업로드 기능은 현재 개발 중입니다.');

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('/api/projects/{project_id}', formData, {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      if (response.status === 200) {
        setIsUploading(false);
        setUploadProgress(100);
        setTimeout(() => {
          setFiles([]);
          onClose();
        }, 2000);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const startUpload = async () => {
    setIsUploading(true);
    await handleUpload();
  };

  const handleClose = () => {
    setFiles([]);
    onClose();
  };

  return (
    <div className="mx-auto w-[610px]">
      <div className="relative flex flex-col gap-5 p-5 bg-white border border-gray-200 shadow-md rounded-2xl">
        <div className="flex items-center justify-between">
          <span className="font-sans text-2xl font-bold leading-tight text-gray-1000">{title}</span>
          <CloseButton onClick={handleClose} />
        </div>
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
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
          <Button
            isActive={files.length > 0 && !isUploading}
            text={isUploading ? `업로드 중... (${uploadProgress}%)` : buttonText}
            onClick={startUpload}
            progress={uploadProgress}
          />
        </div>
      </div>
    </div>
  );
}
