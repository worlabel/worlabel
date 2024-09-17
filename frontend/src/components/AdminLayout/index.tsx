import { Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Header from '../Header';
import { ResizablePanelGroup, ResizablePanel } from '../ui/resizable';
import AdminProjectSidebar from '../AdminProjectSidebar';
import AdminMenuSidebar from '../AdminMenuSidebar';
import { Workspace } from '@/types';

interface AdminLayoutProps {
  workspace?: Workspace;
}

export default function AdminLayout({ workspace }: AdminLayoutProps) {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const numericWorkspaceId = workspaceId ? parseInt(workspaceId, 10) : 0;

  const effectiveWorkspace: Workspace = workspace || {
    id: numericWorkspaceId,
    name: workspaceId ? `workspace-${workspaceId}` : 'default-workspace',
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
    <>
      <Header className="fixed left-0 top-0" />
      <div className="mt-16 h-[calc(100vh-64px)] w-screen">
        <ResizablePanelGroup direction="horizontal">
          <AdminProjectSidebar
            workspaceName={effectiveWorkspace.name}
            projects={effectiveWorkspace.projects}
          />
          <ResizablePanel className="flex w-full items-center">
            <main className="h-full grow">
              <Outlet />
            </main>
          </ResizablePanel>
          <AdminMenuSidebar />
        </ResizablePanelGroup>
      </div>
    </>
  );
}
