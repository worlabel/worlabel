import { ResizablePanel, ResizableHandle } from '../ui/resizable';
import { Link, useLocation, useParams } from 'react-router-dom';
import { SquarePen } from 'lucide-react';
import useProjectListQuery from '@/queries/projects/useProjectListQuery';
import useCreateProjectQuery from '@/queries/projects/useCreateProjectQuery';
import useWorkspaceQuery from '@/queries/workspaces/useWorkspaceQuery';
import { ProjectRequest } from '@/types';
import useAuthStore from '@/stores/useAuthStore';
import ProjectCreateModal from '../ProjectCreateModal';
import { cn } from '@/lib/utils';

export default function AdminProjectSidebar(): JSX.Element {
  const location = useLocation();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const { data: workspaceData } = useWorkspaceQuery(Number(workspaceId), memberId);
  const workspaceTitle = workspaceData?.title || `Workspace-${workspaceId}`;

  const { data: projectsResponse } = useProjectListQuery(Number(workspaceId), memberId);
  const projects = projectsResponse?.workspaceResponses ?? [];

  const createProject = useCreateProjectQuery();

  const handleCreateProject = (data: ProjectRequest) => {
    createProject.mutate({
      workspaceId: Number(workspaceId),
      memberId,
      data,
    });
  };

  const selectedProjectId = new URLSearchParams(location.search).get('projectId');

  return (
    <>
      <ResizablePanel
        minSize={15}
        maxSize={35}
        defaultSize={20}
        className="flex h-full flex-col border-r border-gray-200 bg-gray-100"
      >
        <header className="flex w-full items-center justify-between gap-2 border-b border-gray-200 p-4">
          <h1
            className="heading w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-xl font-bold text-gray-900"
            onClick={() => {
              window.history.replaceState({}, '', location.pathname);
            }}
          >
            {workspaceTitle}
          </h1>
          <button className="p-2">
            <SquarePen size={16} />
          </button>
          <ProjectCreateModal
            buttonClass="caption bg-gray-100"
            onSubmit={handleCreateProject}
          />
        </header>
        <div className="flex flex-col gap-2 p-4">
          {projects.map((project) => {
            const isActive = String(project.id) === selectedProjectId;
            return (
              <Link
                key={project.id}
                to={{
                  pathname: location.pathname,
                  search: `?projectId=${project.id}`,
                }}
                className={cn(
                  'body cursor-pointer rounded-md px-3 py-2 text-left hover:bg-gray-200',
                  isActive ? 'bg-gray-300 font-semibold' : ''
                )}
              >
                {project.title}
              </Link>
            );
          })}
        </div>
      </ResizablePanel>
      <ResizableHandle className="bg-gray-300" />
    </>
  );
}
