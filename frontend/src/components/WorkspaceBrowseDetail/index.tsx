import { useParams } from 'react-router-dom';
import ProjectCard from '@/components/ProjectCard';
import { Smile } from 'lucide-react';
import ProjectCreateModal from '../ProjectCreateModal';
import { useGetAllProjects, useCreateProject } from '@/hooks/useProjectHooks';
import useAuthStore from '@/stores/useAuthStore';
import { Key } from 'react';

export default function WorkspaceBrowseDetail() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const numericWorkspaceId = Number(workspaceId);
  const { profile } = useAuthStore();
  const memberId = profile.id ?? 0;

  const { data: projectsResponse, isLoading, isError, refetch } = useGetAllProjects(numericWorkspaceId || 0, memberId);
  const createProject = useCreateProject();

  const handleCreateProject = (data: { title: string; labelType: 'Classification' | 'Detection' | 'Segmentation' }) => {
    createProject.mutate(
      {
        workspaceId: numericWorkspaceId,
        memberId,
        data: { title: data.title, projectType: data.labelType.toLowerCase() },
      },
      {
        onSuccess: () => {
          console.log('프로젝트가 성공적으로 생성되었습니다.');
          refetch();
        },
        onError: (error) => {
          console.error('프로젝트 생성 실패:', error);
          console.log('Error details:', JSON.stringify(error, null, 2));

          const errorMessage = error?.response?.data?.message || error.message || '알 수 없는 오류';
          console.error('프로젝트 생성 실패:', errorMessage);
        },
      }
    );
  };

  const projects = Array.isArray(projectsResponse?.data?.workspaceResponses)
    ? projectsResponse.data.workspaceResponses
    : [];

  if (isLoading) {
    return <p>Loading projects...</p>;
  }

  if (isError || !workspaceId) {
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

  return (
    <div className="flex h-full w-full flex-col gap-8 px-6 py-4">
      <div className="flex items-center justify-center">
        <h1 className="small-title flex grow">{`Workspace-${workspaceId}`}</h1>
        <div className="flex flex-col">
          <div className="flex gap-3">
            <ProjectCreateModal onSubmit={handleCreateProject} />
          </div>
        </div>
      </div>
      {projects.length > 0 ? (
        <div className="flex flex-wrap gap-6">
          {projects.map((project: { id: Key | null | undefined; title: string; projectType: string }) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.projectType}
              onClick={() => {
                console.log('project id : ' + project.id);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <Smile
              size={48}
              className="mb-2 text-gray-300"
            />
            <div className="body text-gray-400">작업할 프로젝트가 없습니다.</div>
          </div>
        </div>
      )}
    </div>
  );
}
