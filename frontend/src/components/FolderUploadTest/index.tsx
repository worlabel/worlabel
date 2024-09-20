import { uploadImageFolder, uploadImageList } from '@/api/imageApi';
import useAuthStore from '@/stores/useAuthStore';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function FolderUploadTest() {
  const params = useParams<{ workspaceId: string; projectId: string }>();
  const projectId = Number(params.projectId);
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;
  const [files, setFiles] = useState<Array<File>>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
    }
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      console.log('No selected files');
      return;
    }

    setIsUploading(true);
    // uploadImageFolder(projectId, files, 0, memberId);
    uploadImageList(projectId, 0, memberId, files);
  };

  return (
    <div className="min-h-screen w-full bg-blue-300">
      <h1>hello infikei</h1>
      <input
        type="file"
        id="folderInput"
        // webkitdirectory=""
        multiple
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? '업로드하는 중...' : '폴더 업로드'}
      </button>
      <div>
        {files.length > 0 && (
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.webkitRelativePath}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
