import WorkspaceDropdownMenu from '@/components/WorkspaceDropdownMenu';
import { useParams } from 'react-router-dom';

export default function ImageFolderUploadTest() {
  const params = useParams<{ workspaceId: string; projectId: string }>();
  const projectId = Number(params.projectId);

  return (
    <div className="min-h-screen w-full">
      <WorkspaceDropdownMenu
        projectId={projectId}
        folderId={0}
      />
    </div>
  );
}
