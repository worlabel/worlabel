import ImageFolderUploadModal from '@/components/ImageFolderUploadModal';
import ImageFolderZipUploadModal from '@/components/ImageFolderZipUploadModal';
import { useParams } from 'react-router-dom';

export default function ImageFolderUploadTest() {
  const params = useParams<{ workspaceId: string; projectId: string }>();
  const projectId = Number(params.projectId);

  return (
    <div className="min-h-screen w-full">
      <ImageFolderUploadModal
        projectId={projectId}
        parentId={0}
      />
      <ImageFolderZipUploadModal
        projectId={projectId}
        parentId={0}
      />
    </div>
  );
}
