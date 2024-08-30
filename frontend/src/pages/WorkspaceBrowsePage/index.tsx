import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Project, Workspace } from '@/types';
import { Plus, Users } from 'lucide-react';

export default function WorkspaceBrowsePage() {
  const workspaces: Workspace[] = [
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
  ];

  const currentWorkspace: Workspace = {
    id: 1,
    name: 'workspace-1',
  };

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
    <div className="flex h-full">
      <div className="flex w-[280px] flex-col gap-4 border-gray-300 bg-gray-100 px-6 py-4">
        <div className="flex items-center justify-center gap-5">
          <h1 className="heading mr-2.5 w-full">내 워크스페이스</h1>
          <button
            className="p-2"
            onClick={() => {
              console.log('open WorkspaceCreateModal');
            }}
          >
            <Plus size={20} />
          </button>
        </div>
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className={cn(workspace.id === currentWorkspace.id ? 'body-strong' : 'body', 'cursor-pointer')}
            onClick={() => {
              console.log('workspace id : ' + workspace.id);
            }}
          >
            {workspace.name}
          </div>
        ))}
      </div>
      <div className="flex w-[calc(100%-280px)] flex-col gap-8 px-6 py-4">
        <div className="flex items-center justify-center">
          <h1 className="small-title flex grow">{currentWorkspace.name}</h1>
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
    </div>
  );
}
