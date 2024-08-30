import { useParams } from 'react-router-dom';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Project, Workspace } from '@/types';
import { Plus, Smile, Users } from 'lucide-react';

export default function WorkspaceBrowseDetail(): JSX.Element {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const numericWorkspaceId: number | undefined = workspaceId ? Number(workspaceId) : undefined;

  // workspace를 임시로 추가했다. WorkspaceBrowseLayout에서 현재 workspace 데이터를 어떻게 가져올지 생각해봐야 할 것 같다.
  const workspace: Workspace = [
    {
      id: 1,
      name: 'workspace-1',
    },
    {
      id: 2,
      name: 'workspace-2',
    },
    {
      id: 3,
      name: 'workspace-3',
    },
    {
      id: 4,
      name: 'workspace-4',
    },
    {
      id: 5,
      name: 'workspace-5',
    },
  ].filter((workspace) => workspace.id === numericWorkspaceId)[0];

  // 추후에 백엔드에서 받아와야 할 정보이다.
  const projects: Project[] = [
    {
      id: 1,
      name: 'project1',
      type: 'Detection',
      children: [],
    },
    {
      id: 2,
      name: 'project2',
      type: 'Detection',
      children: [],
    },
    {
      id: 3,
      name: 'project3',
      type: 'Detection',
      children: [],
    },
    {
      id: 4,
      name: 'project4',
      type: 'Detection',
      children: [],
    },
    {
      id: 5,
      name: 'project5',
      type: 'Detection',
      children: [],
    },
  ];

  return (
    <>
      {workspace ? (
        <div className="flex w-full flex-col gap-8 px-6 py-4">
          <div className="flex items-center justify-center">
            <h1 className="small-title flex grow">{workspace.name}</h1>
            <div className="flex flex-col">
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('멤버 관리 모달');
                  }}
                >
                  <div className="body flex items-center gap-2">
                    <Users size={16} />
                    <span>멤버 관리</span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('새 프로젝트 생성 모달');
                  }}
                >
                  <div className="body flex items-center gap-2">
                    <Plus size={16} />
                    <span>새 프로젝트</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.name}
                description={project.type}
                onClick={() => {
                  console.log('project id : ' + project.id);
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center">
            <Smile
              size={48}
              className="mb-2 text-gray-300"
            />
            <div className="body text-gray-400">작업할 워크스페이스를 선택하세요.</div>
          </div>
        </div>
      )}
    </>
  );
}
