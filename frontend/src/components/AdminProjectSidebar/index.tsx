import { ResizablePanel, ResizableHandle } from '../ui/resizable';
import { useNavigate, useParams } from 'react-router-dom';
import { SquarePen } from 'lucide-react';
import useProjectListQuery from '@/queries/useProjectListQuery';
import { useCreateProject } from '@/hooks/useProjectHooks';
import { ProjectRequest } from '@/types';
import useAuthStore from '@/stores/useAuthStore';
import ProjectCreateModal from '../ProjectCreateModal';

export default function AdminProjectSidebar(): JSX.Element {
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const { data: projectsResponse } = useProjectListQuery(Number(workspaceId), memberId);

  const projects = projectsResponse?.workspaceResponses ?? [];

  const createProject = useCreateProject();

  const handleCreateProject = (data: ProjectRequest) => {
    createProject.mutate({
      workspaceId: Number(workspaceId),
      memberId,
      data,
    });
  };

  return (
    <>
      <ResizablePanel
        minSize={15}
        maxSize={35}
        defaultSize={20}
        className="flex h-full flex-col border-r border-gray-200 bg-gray-100"
      >
        <header className="flex w-full items-center justify-between gap-2 border-b border-gray-200 p-4">
          <h1 className="heading w-full overflow-hidden text-ellipsis whitespace-nowrap text-xl font-bold text-gray-900">
            {workspaceId}
          </h1>
          <button className="p-2">
            <SquarePen size={16} />
          </button>
          <ProjectCreateModal
            buttonClass="caption border-gray-800 bg-gray-100"
            onSubmit={handleCreateProject}
          />
        </header>
        <div className="flex flex-col gap-2 p-4">
          {projects.map((project) => (
            <button
              key={project.id}
              className="body cursor-pointer rounded-md px-3 py-2 text-left hover:bg-gray-200"
              onClick={() => navigate(`/admin/${workspaceId}/project/${project.id}`)}
            >
              {project.title}
            </button>
          ))}
        </div>
      </ResizablePanel>
      <ResizableHandle className="bg-gray-300" />
    </>
  );
}
