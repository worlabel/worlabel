import { useEffect, Suspense } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Header from '../Header';
import useAuthStore from '@/stores/useAuthStore';
import WorkSpaceCreateModal from '../WorkSpaceCreateModal';
import { WorkspaceRequest, WorkspaceResponse } from '@/types';
import useWorkspaceListQuery from '@/queries/workspaces/useWorkspaceListQuery';
import useCreateWorkspaceQuery from '@/queries/workspaces/useCreateWorkspaceQuery';

export default function WorkspaceBrowseLayout() {
  const { profile, isLoggedIn } = useAuthStore();
  const memberId = profile?.id ?? 0;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || memberId == 0) {
      navigate('/');
    }
  }, [isLoggedIn, memberId, navigate]);

  const { data: workspacesResponse } = useWorkspaceListQuery(memberId ?? 0);
  const createWorkspace = useCreateWorkspaceQuery();

  const handleCreateWorkspace = (data: WorkspaceRequest) => {
    createWorkspace.mutate({
      memberId,
      data,
    });
  };

  const workspaces = workspacesResponse?.workspaceResponses ?? [];

  return (
    <>
      <Header className="fixed left-0 top-0 w-full" />
      <div className="flex min-h-screen flex-col justify-between">
        <div className="mt-16 flex flex-1">
          <div className="flex w-[280px] flex-col gap-4 border-r border-gray-200 bg-gray-100 px-6 py-4">
            <div className="flex items-center justify-center gap-5">
              <h1 className="heading mr-2.5 w-full">내 워크스페이스</h1>
              <WorkSpaceCreateModal onSubmit={handleCreateWorkspace} />
            </div>
            {workspaces.length > 0 ? (
              workspaces.map((workspace: WorkspaceResponse) => (
                <NavLink
                  to={`/browse/${workspace.id}`}
                  key={workspace.id}
                  className={({ isActive }) => (isActive ? 'body-strong' : 'body') + ' cursor-pointer'}
                >
                  {workspace.title}
                </NavLink>
              ))
            ) : (
              <p className="text-gray-500">워크스페이스가 없습니다.</p>
            )}
          </div>
          <div className="flex w-[calc(100%-280px)] flex-col gap-24">
            <main className="grow">
              <Suspense fallback={<div></div>}>
                <Outlet />
              </Suspense>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
