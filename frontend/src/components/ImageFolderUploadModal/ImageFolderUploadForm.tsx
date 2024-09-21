import { useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { uploadImageFolder } from '@/api/imageApi';
import useAuthStore from '@/stores/useAuthStore';

export default function ImageFolderUploadForm({ projectId, parentId }: { projectId: number; parentId: number }) {
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

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

  const handleClick = async () => {
    setIsUploading(true);
    await uploadImageFolder(memberId, projectId, files, parentId);
    setFiles([]);
    setIsUploading(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div
        className={cn(
          'relative flex h-[200px] w-full cursor-pointer items-center justify-center rounded-lg border-2 text-center',
          isDragging ? 'border-solid border-primary bg-blue-200' : 'border-dashed border-gray-500 bg-gray-100'
        )}
      >
        <input
          type="file"
          webkitdirectory=""
          multiple
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          onChange={handleChange}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
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
      {files.length > 0 && (
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file.webkitRelativePath}</li>
          ))}
        </ul>
      )}
      <Button
        onClick={handleClick}
        variant="outlinePrimary"
        disabled={files.length === 0 || isDragging || isUploading}
      >
        {isUploading ? `업로드 중... 0%` : '업로드'}
      </Button>
    </div>
  );
}
