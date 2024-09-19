import { useLocation, useParams } from 'react-router-dom';
import ProjectReviewList from './ProjectReviewList';
import WorkspaceReviewList from './WorkspaceReviewList';

export default function ReviewList(): JSX.Element {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get('projectId');

  return projectId && Number(projectId) > 0 ? (
    <ProjectReviewList
      projectId={Number(projectId)}
      workspaceId={Number(workspaceId)}
    />
  ) : (
    <WorkspaceReviewList workspaceId={Number(workspaceId)} />
  );
}
