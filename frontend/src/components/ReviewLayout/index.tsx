import { Link, Outlet, useParams } from 'react-router-dom';
import Header from '../Header';
import useAuthStore from '@/stores/useAuthStore';
import useWorkspaceQuery from '@/queries/workspaces/useWorkspaceQuery';
import useProjectListQuery from '@/queries/projects/useProjectListQuery';
import { cn } from '@/lib/utils';
import { ProjectResponse } from '@/types';

export default function ReviewLayout() {
  const { workspaceId, projectId } = useParams<{ workspaceId: string; projectId?: string }>();
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const { data: workspaceData } = useWorkspaceQuery(Number(workspaceId), memberId);
  const workspaceTitle = workspaceData?.title || `Workspace-${workspaceId}`;

  const { data: projects } = useProjectListQuery(Number(workspaceId), memberId);

  return (
    <>
      <Header className="fixed left-0 top-0 w-full" />

      <div className="flex min-h-screen flex-col justify-between">
        <div className="mt-16 flex flex-1">
          <div className="flex w-[280px] flex-col border-r border-gray-200 bg-gray-100 p-2">
            <div className="flex items-center justify-center gap-5 p-2">
              <Link
                to={`/review/${workspaceId}`}
                className="heading w-full overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {workspaceTitle}
              </Link>
            </div>
            {projects.map((project: ProjectResponse) => (
              <Link
                key={project.id}
                to={`/review/${workspaceId}/${project.id}`}
                className={cn(
                  'cursor-pointer rounded-lg p-3 hover:bg-gray-200',
                  projectId === String(project.id) ? 'body-strong bg-gray-300' : 'body'
                )}
              >
                {project.title}
              </Link>
            ))}
          </div>

          <div className="flex w-[calc(100%-280px)] flex-col gap-24">
            <main className="h-full grow overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
