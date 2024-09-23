import ImageUploadFileModal from '@/components/ImageUploadFileModal';
import ImageUploadFolderModal from '@/components/ImageUploadFolderModal';
import ImageUploadZipModal from '@/components/ImageUploadZipModal';
import { useParams } from 'react-router-dom';

export default function ImageFolderUploadTest() {
  const params = useParams<{ workspaceId: string; projectId: string }>();
  const projectId = Number(params.projectId);

  return (
    <div className="min-h-screen w-full">
      <ImageUploadFileModal
        projectId={projectId}
        folderId={0}
      />
      <ImageUploadFolderModal projectId={projectId} />
      <ImageUploadZipModal projectId={projectId} />
    </div>
  );
}
