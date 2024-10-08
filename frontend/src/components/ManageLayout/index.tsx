import { Link, Outlet, useParams } from 'react-router-dom';
import Header from '../Header';
import useAuthStore from '@/stores/useAuthStore';
import useWorkspaceQuery from '@/queries/workspaces/useWorkspaceQuery';
import useProjectListQuery from '@/queries/projects/useProjectListQuery';
import { cn } from '@/lib/utils';
import { ProjectResponse } from '@/types';

export default function ManageLayout({ tabTitle }: { tabTitle: string }) {
  const { workspaceId, projectId } = useParams<{ workspaceId: string; projectId?: string }>();
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const { data: workspaceData } = useWorkspaceQuery(Number(workspaceId), memberId);
  const workspaceTitle = workspaceData?.title || `Workspace-${workspaceId}`;

  const { data: projects } = useProjectListQuery(Number(workspaceId), memberId);

  return (
    <>
      <Header />

      <div className="flex min-h-screen flex-col justify-between">
        <div className="mt-16 flex flex-1">
          <div className="flex w-[280px] flex-col gap-1 border-r border-gray-200 bg-gray-100 p-2">
            <div className="flex items-center justify-center gap-5">
              <Link
                to={`/${tabTitle}/${workspaceId}`}
                className="subheading w-full overflow-hidden text-ellipsis whitespace-nowrap p-2"
              >
                {workspaceTitle}
              </Link>
            </div>
            <div className="flex flex-col">
              {projects.map((project: ProjectResponse) => (
                <Link
                  key={project.id}
                  to={`/${tabTitle}/${workspaceId}/${project.id}`}
                  className={cn(
                    'cursor-pointer rounded-lg p-3 hover:bg-gray-200',
                    projectId === String(project.id) ? 'body-strong bg-gray-300' : 'body'
                  )}
                >
                  {project.title}
                </Link>
              ))}
            </div>
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
