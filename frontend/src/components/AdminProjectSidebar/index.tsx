import { ResizablePanel, ResizableHandle } from '../ui/resizable';
import { Project } from '@/types';
import { useNavigate } from 'react-router-dom';
import { SquarePen } from 'lucide-react';
import { Button } from '../ui/button';

interface AdminProjectSidebarProps {
  workspaceName: string;
  projects: Project[];
}

export default function AdminProjectSidebar({ workspaceName, projects }: AdminProjectSidebarProps): JSX.Element {
  const navigate = useNavigate();

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
            {workspaceName}
          </h1>
          <button className="p-2">
            <SquarePen size={16} />
          </button>
          <Button
            variant="outline"
            size="xs"
            className="caption border-gray-800 bg-gray-100"
            onClick={() => console.log('New project')}
          >
            새 프로젝트
          </Button>
        </header>
        <div className="flex flex-col gap-2 p-4">
          {projects.map((project) => (
            <button
              key={project.id}
              className="body cursor-pointer rounded-md px-3 py-2 text-left hover:bg-gray-200"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              {project.name}
            </button>
          ))}
        </div>
      </ResizablePanel>
      <ResizableHandle className="bg-gray-300" />
    </>
  );
}
