import { Suspense } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Header from '../Header';
import { Workspace } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { Plus } from 'lucide-react';
import WorkSpaceCreateForm from '../WorkSpaceCreateModal/WorkSpaceCreateForm';

export default function WorkspaceBrowseLayout() {
  const workspaces: Workspace[] = [
    {
      id: 1,
      name: 'workspace-1',
      projects: [],
    },
    {
      id: 2,
      name: 'workspace-2',
      projects: [],
    },
    {
      id: 3,
      name: 'workspace-3',
      projects: [],
    },
    {
      id: 4,
      name: 'workspace-4',
      projects: [],
    },
    {
      id: 5,
      name: 'workspace-5',
      projects: [],
    },
  ];

  return (
    <>
      <Header className="fixed left-0 top-0 w-full" />
      <div className="flex min-h-screen flex-col justify-between">
        <div className="mt-16 flex flex-1">
          <div className="flex w-[280px] flex-col gap-4 border-r border-gray-200 bg-gray-100 px-6 py-4">
            <div className="flex items-center justify-center gap-5">
              <h1 className="heading mr-2.5 w-full">내 워크스페이스</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="p-2">
                    <Plus size={20} />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader title="새 워크스페이스" />
                  <WorkSpaceCreateForm
                    onSubmit={(data) => {
                      console.log(data);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
            {workspaces.length > 0 ? (
              workspaces.map((workspace) => (
                <NavLink
                  to={`/browse/${workspace.id}`}
                  key={workspace.id}
                  className={({ isActive }) => (isActive ? 'body-strong' : 'body') + ' cursor-pointer'}
                >
                  {workspace.name}
                </NavLink>
              ))
            ) : (
              <p className="text-gray-500">워크스페이스가 없습니다.</p>
            )}
          </div>
          <div className="flex w-[calc(100%-280px)] flex-col gap-24">
            <Suspense fallback={<div></div>}>
              <main className="grow">
                <Outlet />
              </main>
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
