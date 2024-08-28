import { SquarePen } from 'lucide-react';
import { ResizableHandle, ResizablePanel } from '../ui/resizable';
import ProjectStructure from './ProjectStructure';
import { Button } from '../ui/button';
import { Project } from '@/types';

export default function WorkspaceSidebar({ workspaceName, projects }: { workspaceName: string; projects: Project[] }) {
  return (
    <>
      <ResizablePanel
        minSize={10}
        maxSize={35}
        defaultSize={20}
        className="flex h-full flex-col bg-gray-100"
        onResize={(size) => {
          console.log(size);
        }}
      >
        <header className="body flex w-full items-center gap-2 p-2">
          <h1 className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{workspaceName}</h1>
          <button>
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
        <div>
          {projects.map((project) => (
            <ProjectStructure
              key={project.id}
              project={project}
            />
          ))}
        </div>
      </ResizablePanel>
      <ResizableHandle className="bg-gray-300" />
    </>
  );
}
