import { cn } from '@/lib/utils';
import { Link, useParams } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';
import useWorkspaceListQuery from '@/queries/workspaces/useWorkspaceListQuery';

export default function WorkspaceNavigation() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id;

  const { data: workspacesResponse } = useWorkspaceListQuery(memberId ?? 0);
  const workspaces = workspacesResponse?.workspaceResponses || [];

  const activeWorkspaceId = workspaceId ?? workspaces[0]?.id;

  return (
    <nav className="hidden items-center gap-5 md:flex">
      <Link
        to={activeWorkspaceId ? `/browse/${activeWorkspaceId}` : '/browse'}
        className={cn('text-color-text-default-default', 'font-body-strong', 'text-sm sm:text-base md:text-lg')}
      >
        workspace
      </Link>
      {activeWorkspaceId && (
        <>
          <Link
            to={`/workspace/${activeWorkspaceId}`}
            className={cn('text-color-text-default-default', 'font-body', 'text-sm sm:text-base md:text-lg')}
          >
            labeling
          </Link>
          <Link
            to={`/admin/${activeWorkspaceId}`}
            className={cn('text-color-text-default-default', 'font-body', 'text-sm sm:text-base md:text-lg')}
          >
            admin
          </Link>
        </>
      )}
    </nav>
  );
}
