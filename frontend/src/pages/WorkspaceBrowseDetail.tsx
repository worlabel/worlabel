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
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center justify-center">
          <h1 className="heading flex grow">{workspaceData?.title ?? `Workspace-${workspaceId}`}</h1>
          <div className="flex flex-col">
            <ProjectCreateModal
              buttonClass="flex items-center gap-2 h-10 px-4 py-2"
              onSubmit={handleCreateProject}
            />
          </div>
        </div>
        {workspaceData && (
          <div className="flex items-center">
            <p className="body">{workspaceData.content ?? '프로젝트에 대한 설명이 없습니다.'}</p>
          </div>
        )}
      </div>
      {isNaN(workspaceId) || isError || !workspaceId ? (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Smile
            size={48}
            className="mb-2 text-gray-300"
          />
          <div className="body-strong text-gray-400">
            {!workspaceId ? '작업할 워크스페이스를 선택하세요.' : '작업할 프로젝트가 없습니다.'}
          </div>
        </div>
      ) : (
        <>
          {projects.length === 0 ? (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <Smile
                size={48}
                className="mb-2 text-gray-300"
              />
              <div className="body-strong text-gray-400">작업할 프로젝트가 없습니다.</div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6">
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
          )}
        </>
      )}
    </div>
  );
}
