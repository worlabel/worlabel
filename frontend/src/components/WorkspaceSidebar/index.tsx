import { useNavigate, useParams } from 'react-router-dom';
import { ResizableHandle, ResizablePanel } from '../ui/resizable';
import ProjectStructure from './ProjectStructure';
import { Project } from '@/types';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';
import useCanvasStore from '@/stores/useCanvasStore';
import { webPath } from '@/router';
import { Suspense, useEffect } from 'react';

export default function WorkspaceSidebar({ workspaceName, projects }: { workspaceName: string; projects: Project[] }) {
  const { setImage } = useCanvasStore();
  const { projectId: selectedProjectId, workspaceId } = useParams<{ projectId: string; workspaceId: string }>();
  const selectedProject = projects.find((project) => project.id.toString() === selectedProjectId) || null;
  const setSidebarSize = useCanvasStore((state) => state.setSidebarSize);
  const navigate = useNavigate();
  const handleSelectProject = (projectId: string) => {
    setImage(null);
    navigate(`${webPath.workspace()}/${workspaceId}/${projectId}`);
  };

  useEffect(() => {
    if (!selectedProject) {
      setImage(null);
    }
  }, [selectedProject, setImage]);

  return (
    <>
      <ResizablePanel
        minSize={10}
        maxSize={35}
        defaultSize={15}
        onResize={(size) => setSidebarSize(size)}
      >
        <div className="box-border flex h-full flex-col gap-2 bg-gray-50 p-3">
          <header className="body flex w-full items-center gap-2">
            <h1 className="subheading w-full overflow-hidden text-ellipsis whitespace-nowrap">{workspaceName}</h1>
          </header>
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
          <Suspense fallback={<div></div>}>
            {selectedProject && <ProjectStructure project={selectedProject} />}
          </Suspense>
        </div>
      </ResizablePanel>
      <ResizableHandle className="bg-gray-300" />
    </>
  );
}
