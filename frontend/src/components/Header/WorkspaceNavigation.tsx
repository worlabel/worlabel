import { cn } from '@/lib/utils';
import { Link, useLocation, useParams } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';
import useWorkspaceListQuery from '@/queries/workspaces/useWorkspaceListQuery';

export default function WorkspaceNavigation() {
  const location = useLocation();
  const isBrowsePage = location.pathname.startsWith('/browse');
  const isWorkspacePage = location.pathname.startsWith('/workspace');
  const isReviewPage = location.pathname.startsWith('/review');
  const isModelPage = location.pathname.startsWith('/model');
  const isMemberPage = location.pathname.startsWith('/member');

  const { workspaceId } = useParams<{ workspaceId: string }>();
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id;

  const { data: workspacesResponse } = useWorkspaceListQuery(memberId ?? 0);
  const workspaces = workspacesResponse?.workspaceResponses || [];

  const activeWorkspaceId = workspaceId ?? workspaces[0]?.id;

  if (workspaces.length === 0) {
    return <div></div>;
  }

  return (
    <nav className="hidden items-center gap-5 md:flex">
      <Link
        to={activeWorkspaceId ? `/browse/${activeWorkspaceId}` : '/browse'}
        className={cn('', isBrowsePage ? 'body-strong' : 'body')}
      >
        workspace
      </Link>
      {activeWorkspaceId && (
        <>
          <Link
            to={`/workspace/${activeWorkspaceId}`}
            className={isWorkspacePage ? 'body-strong' : 'body'}
          >
            labeling
          </Link>
          <Link
            to={`/review/${activeWorkspaceId}`}
            className={isReviewPage ? 'body-strong' : 'body'}
          >
            review
          </Link>
          <Link
            to={`/model/${activeWorkspaceId}`}
            className={isModelPage ? 'body-strong' : 'body'}
          >
            model
          </Link>
          <Link
            to={`/member/${activeWorkspaceId}`}
            className={isMemberPage ? 'body-strong' : 'body'}
          >
            member
          </Link>
        </>
      )}
    </nav>
  );
}
