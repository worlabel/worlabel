import { useNavigate, useParams } from 'react-router-dom';
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
  const navigate = useNavigate();

  const { data: workspaceData } = useWorkspaceQuery(workspaceId, memberId);
  const { data: projectsResponse, isError } = useProjectListQuery(workspaceId, memberId);

  const createProject = useCreateProjectQuery();

  const handleCreateProject = (data: ProjectRequest) => {
    createProject.mutate({
      workspaceId,
      memberId,
      data,
    });
  };

  const projects: ProjectResponse[] = projectsResponse?.workspaceResponses ?? [];

  return (
    <div className="flex h-full w-full flex-col gap-8 px-6 py-4">
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
          navigate={navigate}
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
    <div className="flex items-center justify-center">
      <h1 className="small-title flex grow">{workspaceName}</h1>
      <div className="flex flex-col">
        <div className="flex gap-3">
          <ProjectCreateModal
            buttonClass="mt-4 flex items-center gap-2 body-small-strong"
            onSubmit={onCreateProject}
          />
        </div>
      </div>
    </div>
  );
}

function EmptyStateMessage({ workspaceId }: { workspaceId: number }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <Smile
          size={48}
          className="mb-2 text-gray-300"
        />
        <div className="body text-gray-400">
          {!workspaceId ? '작업할 워크스페이스를 선택하세요.' : '작업할 프로젝트가 없습니다.'}
        </div>
      </div>
    </div>
  );
}

function ProjectList({
  projects,
  workspaceId,
  navigate,
}: {
  projects: ProjectResponse[];
  workspaceId: number;
  navigate: ReturnType<typeof useNavigate>;
}) {
  if (projects.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Smile
          size={48}
          className="mb-2 text-gray-300"
        />
        <div className="body text-gray-400">작업할 프로젝트가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6">
      {projects.map((project: ProjectResponse) => (
        <ProjectCard
          key={project.id}
          title={project.title}
          description={project.projectType}
          onClick={() => {
            navigate(`${webPath.workspace()}/${workspaceId}/project/${project.id}`);
          }}
        />
      ))}
    </div>
  );
}
