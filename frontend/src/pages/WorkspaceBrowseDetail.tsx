import { useNavigate, useParams } from 'react-router-dom';
import ProjectCard from '@/components/ProjectCard';
import { Smile } from 'lucide-react';
import ProjectCreateModal from '../components/ProjectCreateModal';
import useAuthStore from '@/stores/useAuthStore';
import { ProjectResponse } from '@/types';
import useProjectListQuery from '@/queries/useProjectListQuery';
import { webPath } from '@/router';

export default function WorkspaceBrowseDetail() {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = Number(params.workspaceId);
  const { profile } = useAuthStore();
  const memberId = profile?.id ?? 0;
  const navigate = useNavigate();
  // const createProject = useCreateProject();

  const { data: projectsResponse, isError } = useProjectListQuery(workspaceId, memberId);

  const handleCreateProject = (data: { title: string; labelType: 'classification' | 'detection' | 'segmentation' }) => {
    console.log(data);
    // createProject.mutate(
    //   {
    //     workspaceId: workspaceId,
    //     memberId,
    //     data: { title: data.title, projectType: data.labelType },
    //   },
    //   {
    //     onSuccess: () => {
    //       console.log('프로젝트가 성공적으로 생성되었습니다.');
    //       refetch();
    //     },
    //     onError: (error) => {
    //       console.error('프로젝트 생성 실패:', error);
    //       const errorMessage = error?.response?.data?.message || error.message || '알 수 없는 오류';
    //       console.error('프로젝트 생성 실패:', errorMessage);
    //     },
    //   }
    // );
  };

  // TODO: 반환 형식 반영 projectsResponse?.workspaceResponses => projectResponse
  const projects: ProjectResponse[] = projectsResponse?.workspaceResponses ?? [];

  if (isNaN(workspaceId)) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <Smile
            size={48}
            className="mb-2 text-gray-300"
          />
          <div className="body text-gray-400">작업할 워크스페이스를 선택하세요</div>
        </div>
      </div>
    );
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
            <ProjectCreateModal
              buttonClass="mt-4 flex items-center gap-2"
              onSubmit={handleCreateProject}
            />
          </div>
        </div>
      </div>
      {projects.length > 0 ? (
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
