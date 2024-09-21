import { useParams } from 'react-router-dom';
import ImageFolderUploadModal from '../ImageFolderUploadModal';

export default function FolderUploadTest() {
  const params = useParams<{ workspaceId: string; projectId: string }>();
  const projectId = Number(params.projectId);

  return (
    <div className="min-h-screen w-full">
      <ImageFolderUploadModal
        projectId={projectId}
        parentId={0}
      />
    </div>
  );
}
