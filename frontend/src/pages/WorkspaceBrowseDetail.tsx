import { useParams } from 'react-router-dom';
import ProjectCard from '@/components/ProjectCard';
import { Smile } from 'lucide-react';
import ProjectCreateModal from '../components/ProjectCreateModal';
import useAuthStore from '@/stores/useAuthStore';
import { ProjectResponse, ProjectRequest } from '@/types';
import useProjectListQuery from '@/queries/projects/useProjectListQuery';
import useWorkspaceQuery from '@/queries/workspaces/useWorkspaceQuery';
import useCreateProjectQuery from '@/queries/projects/useCreateProjectQuery';
import { webPath } from '@/router';

export default function WorkspaceBrowseDetail() {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = Number(params.workspaceId);
  const { profile } = useAuthStore();
  const memberId = profile?.id ?? 0;

  const { data: workspaceData } = useWorkspaceQuery(workspaceId, memberId);
  const { data: projects, isError } = useProjectListQuery(workspaceId, memberId);

  const createProject = useCreateProjectQuery();

  const handleCreateProject = (data: ProjectRequest) => {
    createProject.mutate({
      workspaceId,
      memberId,
      data,
    });
  };

  return (
    <div className="flex h-full w-full flex-col">
      <HeaderSection
        workspaceName={workspaceData?.title ?? `Workspace-${workspaceId}`}
        onCreateProject={handleCreateProject}
      />
      {isNaN(workspaceId) || isError || !workspaceId ? (
        <EmptyStateMessage workspaceId={workspaceId} />
      ) : (
        <ProjectList
          projects={projects}
          workspaceId={workspaceId}
        />
      )}
    </div>
  );
}

function HeaderSection({
  workspaceName,
  onCreateProject,
}: {
  workspaceName: string;
  onCreateProject: (data: ProjectRequest) => void;
}) {
  return (
    <div className="flex h-16 items-center justify-center px-4">
      <h1 className="heading flex grow">{workspaceName}</h1>
      <div className="flex flex-col">
        <ProjectCreateModal
          buttonClass="flex items-center gap-2 h-10 px-4 py-2"
          onSubmit={onCreateProject}
        />
      </div>
    </div>
  );
}

function EmptyStateMessage({ workspaceId }: { workspaceId: number }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Smile
        size={48}
        className="mb-2 text-gray-300"
      />
      <div className="body-strong text-gray-400">
        {!workspaceId ? '작업할 워크스페이스를 선택하세요.' : '작업할 프로젝트가 없습니다.'}
      </div>
    </div>
  );
}

function ProjectList({ projects, workspaceId }: { projects: ProjectResponse[]; workspaceId: number }) {
  if (projects.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Smile
          size={48}
          className="mb-2 text-gray-300"
        />
        <div className="body-strong text-gray-400">작업할 프로젝트가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6 px-4 pb-4">
      {projects.map((project: ProjectResponse) => (
        <ProjectCard
          key={project.id}
          title={project.title}
          to={`${webPath.workspace()}/${workspaceId}/${project.id}`}
          description={project.projectType}
          imageUrl={project.thumbnail}
        />
      ))}
    </div>
  );
}
