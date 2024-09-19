import { useEffect, useState } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import Header from '../Header';
import { Label, Project } from '@/types';
import { ResizablePanelGroup } from '../ui/resizable';
// import { ResizablePanel } from '../ui/resizable';
import WorkspaceSidebar from '../WorkspaceSidebar';
import useAuthStore from '@/stores/useAuthStore';
import useCanvasStore from '@/stores/useCanvasStore';
import useFolderQuery from '@/queries/folders/useFolderQuery';
import useWorkspaceQuery from '@/queries/workspaces/useWorkspaceQuery';
import useProjectListQuery from '@/queries/projects/useProjectListQuery';

const mockLabels: Label[] = [
  {
    id: 1,
    name: 'Label 1',
    color: '#FFaa33',
    coordinates: [
      [700, 100],
      [1200, 800],
    ],
    type: 'rect',
  },
  {
    id: 2,
    name: 'Label 2',
    color: '#aaFF55',
    coordinates: [
      [200, 200],
      [400, 200],
      [500, 500],
      [400, 800],
      [200, 800],
      [100, 500],
    ],
    type: 'polygon',
  },
  {
    id: 3,
    name: 'Label 3',
    color: '#77aaFF',
    coordinates: [
      [1000, 1000],
      [1800, 1800],
    ],
    type: 'rect',
  },
];

export default function WorkspaceLayout() {
  const setLabels = useCanvasStore((state) => state.setLabels);
  const params = useParams<{ workspaceId: string; projectId: string }>();
  const workspaceId = Number(params.workspaceId);
  const projectId = Number(params.projectId);
  const [workspace, setWorkspace] = useState<{ name: string; projects: Project[] }>({
    name: '',
    projects: [],
  });
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;
  const { data: workspaceData } = useWorkspaceQuery(workspaceId, memberId);
  const { data: projectListData } = useProjectListQuery(workspaceId, memberId);
  const { data: folderData } = useFolderQuery(projectId, 0, memberId);

  useEffect(() => {
    if (!workspaceData) return;
    setWorkspace((prev) => ({
      ...prev,
      name: workspaceData.title,
    }));
  }, [workspaceData]);

  useEffect(() => {
    if (!projectListData) return;
    console.log(folderData);
    const projects = projectListData.workspaceResponses.map(
      (project): Project => ({
        id: project.id,
        name: project.title,
        type: (project.projectType.charAt(0).toUpperCase() + project.projectType.slice(1)) as
          | 'Classification'
          | 'Detection'
          | 'Segmentation',
        children: [],
      })
    );
    setWorkspace((prev) => ({
      ...prev,
      projects,
    }));
  }, [folderData, projectListData]);

  useEffect(() => {
    setLabels(mockLabels);
  }, [setLabels]);

  return (
    <>
      <Header className="fixed left-0 top-0" />
      <div className="mt-16 h-[calc(100vh-64px)] w-screen">
        <ResizablePanelGroup direction="horizontal">
          <WorkspaceSidebar
            workspaceName={workspace.name}
            projects={workspace.projects}
          />
          <Outlet />
        </ResizablePanelGroup>
      </div>
    </>
  );
}
