import { useNavigate, useParams } from 'react-router-dom';
import { ResizableHandle, ResizablePanel } from '../ui/resizable';
import ProjectStructure from './ProjectStructure';
import { Project } from '@/types';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';
import useCanvasStore from '@/stores/useCanvasStore';
import { webPath } from '@/router';
import { useState } from 'react';
import useUploadImageFileQuery from '@/queries/projects/useUploadImageFileQuery';
import useAuthStore from '@/stores/useAuthStore';

export default function WorkspaceSidebar({ workspaceName, projects }: { workspaceName: string; projects: Project[] }) {
  const { projectId: selectedProjectId } = useParams<{ projectId: string }>();
  const selectedProject = projects.find((project) => project.id.toString() === selectedProjectId);
  const setSidebarSize = useCanvasStore((state) => state.setSidebarSize);
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isDragging, setIsDragging] = useState(false);
  const uploadImageFileMutation = useUploadImageFileQuery();
  const { profile } = useAuthStore();

  const handleSelectProject = (projectId: string) => {
    navigate(`${webPath.workspace()}/${workspaceId}/project/${projectId}`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!selectedProjectId || !profile) return;

    const files = Array.from(e.dataTransfer.files);
    const memberId = profile.id;
    const projectId = parseInt(selectedProjectId);
    const folderId = 0;

    uploadImageFileMutation.mutate({
      memberId,
      projectId,
      folderId,
      files,
      progressCallback: (progress) => {
        console.log(`업로드 진행률: ${progress}%`);
      },
    });
  };

  return (
    <>
      <ResizablePanel
        minSize={10}
        maxSize={35}
        defaultSize={20}
        className={`flex h-full flex-col bg-gray-50 ${isDragging ? 'bg-blue-100' : ''}`}
        onResize={(size) => setSidebarSize(size)}
        onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent<Element>)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e as unknown as React.DragEvent<Element>)}
      >
        <header className="body flex w-full items-center gap-2 p-2">
          <h1 className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{workspaceName}</h1>
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
