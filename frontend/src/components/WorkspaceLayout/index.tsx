import { useEffect, useState } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import Header from '../Header';
import { Project } from '@/types';
import { ResizablePanelGroup } from '../ui/resizable';
import WorkspaceSidebar from '../WorkspaceSidebar';
import useAuthStore from '@/stores/useAuthStore';
import useWorkspaceQuery from '@/queries/workspaces/useWorkspaceQuery';
import useProjectListQuery from '@/queries/projects/useProjectListQuery';

export default function WorkspaceLayout() {
  const params = useParams<{ workspaceId: string; projectId: string }>();
  const workspaceId = Number(params.workspaceId);
  const [workspace, setWorkspace] = useState<{ name: string; projects: Project[] }>({
    name: '',
    projects: [],
  });
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;
  const { data: workspaceData } = useWorkspaceQuery(workspaceId, memberId);
  const { data: projectListData } = useProjectListQuery(workspaceId, memberId);

  useEffect(() => {
    if (!workspaceData) return;
    setWorkspace((prev) => ({
      ...prev,
      name: workspaceData.title,
    }));
  }, [workspaceData]);

  useEffect(() => {
    if (!projectListData) return;
    const projects = projectListData.workspaceResponses.map(
      (project): Project => ({
        id: project.id,
        name: project.title,
        type: project.projectType,
        children: [],
      })
    );
    setWorkspace((prev) => ({
      ...prev,
      projects,
    }));
  }, [projectListData]);

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
