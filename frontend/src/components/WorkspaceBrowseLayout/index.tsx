import { Suspense, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Header from '../Header';
import { useGetAllWorkspaces, useCreateWorkspace } from '@/hooks/useWorkspaceHooks';
import useAuthStore from '@/stores/useAuthStore';
import WorkSpaceCreateModal from '../WorkSpaceCreateModal';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { WorkspaceRequestDTO, WorkspaceResponseDTO, CustomError } from '@/types';

export default function WorkspaceBrowseLayout() {
  const { profile, isLoggedIn } = useAuthStore();
  const memberId = profile?.id ?? 0;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoggedIn || !memberId) {
      console.error('로그인되지 않았거나 유효한 멤버 ID가 없습니다.');
      navigate('/');
    }
  }, [isLoggedIn, memberId, navigate]);

  const { data: workspacesResponse, isLoading, isError } = useGetAllWorkspaces(memberId || 0);

  const workspaces = workspacesResponse?.data?.workspaceResponses || [];

  const createWorkspace = useCreateWorkspace();

  const handleCreateWorkspace = (data: WorkspaceRequestDTO) => {
    if (!memberId) return;
    createWorkspace.mutate(
      { memberId, data },
      {
        onSuccess: () => {
          console.log('워크스페이스가 성공적으로 생성되었습니다.');
          queryClient.invalidateQueries({ queryKey: ['workspaces'] });
        },
        onError: (error: AxiosError<CustomError>) => {
          console.error('워크스페이스 생성 실패:', error.message);
        },
      }
    );
  };

  if (isLoading) {
    return <p>Loading workspaces...</p>;
  }

  if (isError) {
    return <p>Error loading workspaces. Please try again later.</p>;
  }

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
              workspaces.map((workspace: WorkspaceResponseDTO) => (
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
