import { Outlet } from 'react-router-dom';
import Header from '../Header';
import { ResizablePanelGroup, ResizablePanel } from '../ui/resizable';
import AdminProjectSidebar from '../AdminProjectSidebar';
import AdminMenuSidebar from '../AdminMenuSidebar';
import { Workspace } from '@/types';

interface AdminLayoutProps {
  workspace: Workspace;
}

export default function AdminLayout({ workspace }: AdminLayoutProps) {
  return (
    <>
      <Header className="fixed left-0 top-0" />
      <div className="mt-16 h-[calc(100vh-64px)] w-screen">
        <ResizablePanelGroup direction="horizontal">
          <AdminProjectSidebar
            workspaceName={workspace.name}
            projects={workspace.projects}
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
