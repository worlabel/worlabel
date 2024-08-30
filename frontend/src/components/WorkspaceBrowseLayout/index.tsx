import { Suspense } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { Workspace } from '@/types';
import { Plus } from 'lucide-react';

export default function WorkspaceBrowseLayout() {
  const workspaces: Workspace[] = [
    {
      id: 1,
      name: 'workspace-1',
    },
    {
      id: 2,
      name: 'workspace-2',
    },
    {
      id: 3,
      name: 'workspace-3',
    },
    {
      id: 4,
      name: 'workspace-4',
    },
    {
      id: 5,
      name: 'workspace-5',
    },
  ];

  return (
    <>
      <Header className="fixed left-0 top-0 w-full" />
      <div className="flex min-h-screen flex-col justify-between">
        <div className="mt-16 flex flex-1">
          <div className="flex w-[280px] flex-col gap-4 border-gray-300 bg-gray-100 px-6 py-4">
            <div className="flex items-center justify-center gap-5">
              <h1 className="heading mr-2.5 w-full">내 워크스페이스</h1>
              <button
                className="p-2"
                onClick={() => {
                  console.log('open WorkspaceCreateModal');
                }}
              >
                <Plus size={20} />
              </button>
            </div>
            {workspaces.map((workspace) => (
              <NavLink
                to={`/browse/${workspace.id}`}
                key={workspace.id}
                className={({ isActive }) => (isActive ? 'body-strong' : 'body') + ' cursor-pointer'}
              >
                {workspace.name}
              </NavLink>
            ))}
          </div>
          <div className="flex w-[calc(100%-280px)] flex-col gap-24">
            <Suspense fallback={<div></div>}>
              <main className="grow">
                <Outlet />
              </main>
            </Suspense>
            <Footer className="mt-0" />
          </div>
        </div>
      </div>
    </>
  );
}
