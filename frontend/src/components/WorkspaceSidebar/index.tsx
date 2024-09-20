import { useNavigate, useParams } from 'react-router-dom';
import { SquarePen } from 'lucide-react';
import { ResizableHandle, ResizablePanel } from '../ui/resizable';
import ProjectStructure from './ProjectStructure';
import { Project } from '@/types';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';
import ProjectCreateModal from '../ProjectCreateModal';
import useCanvasStore from '@/stores/useCanvasStore';
import { webPath } from '@/router';

export default function WorkspaceSidebar({ workspaceName, projects }: { workspaceName: string; projects: Project[] }) {
  const { projectId: selectedProjectId } = useParams<{ projectId: string }>();
  const selectedProject = projects.find((project) => project.id.toString() === selectedProjectId);
  const setSidebarSize = useCanvasStore((state) => state.setSidebarSize);
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  // const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();
  const handleSelectProject = (projectId: string) => {
    // setSelectedProjectId(projectId);
    navigate(`${webPath.workspace()}/${workspaceId}/${projectId}`);
  };

  return (
    <>
      <ResizablePanel
        minSize={10}
        maxSize={35}
        defaultSize={20}
        className="flex h-full flex-col bg-gray-50"
        onResize={(size) => setSidebarSize(size)}
      >
        <header className="body flex w-full items-center gap-2 p-2">
          <h1 className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{workspaceName}</h1>
          <button>
            <SquarePen size={16} />
          </button>
          <ProjectCreateModal
            onSubmit={(data) => console.log('프로젝트 생성:', data)}
            buttonClass="caption bg-gray-50"
          />
        </header>
        <div className="p-2">
          <Select
            onValueChange={handleSelectProject}
            defaultValue={selectedProjectId}
          >
            <SelectTrigger>
              <SelectValue placeholder="프로젝트를 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem
                  key={project.id}
                  value={project.id.toString()}
                >
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedProject && <ProjectStructure project={selectedProject} />}
      </ResizablePanel>
      <ResizableHandle className="bg-gray-300" />
    </>
  );
}
