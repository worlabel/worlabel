import { Outlet, useMatch } from 'react-router-dom';
import Header from '../Header';
import { ResizablePanelGroup, ResizablePanel } from '../ui/resizable';
import AdminProjectSidebar from '../AdminProjectSidebar';
import AdminMenuSidebar from '../AdminMenuSidebar';

export default function AdminLayout() {
  const isIndexPage = useMatch({ path: '/admin/:workspaceId', end: true });

  return (
    <>
      <Header className="fixed left-0 top-0" />
      <div className="mt-16 h-[calc(100vh-64px)] w-screen">
        <ResizablePanelGroup direction="horizontal">
          {!isIndexPage && <AdminProjectSidebar />}

          <ResizablePanel className="flex w-full items-center">
            <main className="h-full grow">
              <Outlet />
            </main>
          </ResizablePanel>
          <AdminMenuSidebar />
        </ResizablePanelGroup>
        {isIndexPage && (
          <main className="h-full w-full">
            <Outlet />
          </main>
        )}
      </div>
    </>
  );
}
