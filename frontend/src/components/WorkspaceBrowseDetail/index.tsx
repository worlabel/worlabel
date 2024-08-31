import { useParams } from 'react-router-dom';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Workspace } from '@/types';
import { Plus, Smile, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import WorkSpaceCreateForm from '../WorkSpaceCreateModal/WorkSpaceCreateForm';

export default function WorkspaceBrowseDetail() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const numericWorkspaceId: number = Number(workspaceId);
  const workspace: Workspace = !workspaceId
    ? {
        id: 0,
        name: '',
        projects: [],
      }
    : {
        id: numericWorkspaceId,
        name: `workspace-${workspaceId}`,
        projects: [
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
        ],
      };

  return (
    <div className="flex h-full w-full flex-col gap-8 px-6 py-4">
      <div className="flex items-center justify-center">
        <h1 className="small-title flex grow">{workspaceId ? workspace.name : ''}</h1>
        <div className="flex flex-col">
          <div className="flex gap-3">
            {workspaceId ? (
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
            ) : (
              <></>
            )}
            <Dialog>
              <DialogTrigger asChild>
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
              </DialogTrigger>
              <DialogContent>
                <DialogHeader title="새 워크스페이스" />
                <WorkSpaceCreateForm
                  onSubmit={(data) => {
                    console.log(data);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      {workspaceId ? (
        <div className="flex flex-wrap gap-6">
          {workspace.projects.map((project) => (
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
      ) : (
        <div className="flex w-full grow items-center justify-center">
          <div className="flex flex-col items-center">
            <Smile
              size={48}
              className="mb-2 text-gray-300"
            />
            <div className="body text-gray-400">작업할 워크스페이스를 선택하세요.</div>
          </div>
        </div>
      )}
    </div>
  );
}
