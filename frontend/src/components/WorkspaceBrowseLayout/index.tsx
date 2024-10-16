import { useEffect, Suspense, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header';
import useAuthStore from '@/stores/useAuthStore';
import { ProjectRequest, WorkspaceRequest, WorkspaceResponse } from '@/types';
import useWorkspaceListQuery from '@/queries/workspaces/useWorkspaceListQuery';
import useCreateWorkspaceQuery from '@/queries/workspaces/useCreateWorkspaceQuery';
import { cn } from '@/lib/utils';
import { Ellipsis } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import WorkSpaceCreateForm, { WorkSpaceCreateFormValues } from '../WorkSpaceCreateModal/WorkSpaceCreateForm';
import ProjectCreateForm, { ProjectCreateFormValues } from '../ProjectCreateModal/ProjectCreateForm';
import useCreateProjectQuery from '@/queries/projects/useCreateProjectQuery';
import WorkspaceUpdateForm, { WorkspaceUpdateFormValues } from '../WorkspaceUpdateModal/WorkspaceUpdateForm';
import useUpdateWorkspaceQuery from '@/queries/workspaces/useUpdateWorkspaceQuery';

export default function WorkspaceBrowseLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const memberId = profile?.id ?? 0;

  const [isOpenWorkspaceCreate, setIsOpenWorkspaceCreate] = useState<boolean>(false);
  const [isOpenWorkspaceUpdate, setIsOpenWorkspaceUpdate] = useState<boolean>(false);
  const [isOpenProjectCreate, setIsOpenProjectCreate] = useState<boolean>(false);

  useEffect(() => {
    if (memberId == 0) {
      navigate('/');
    }
  }, [memberId, navigate]);

  const createWorkspace = useCreateWorkspaceQuery();
  const updateWorkspace = useUpdateWorkspaceQuery();
  const createProject = useCreateProjectQuery();

  const { data: workspacesResponse, refetch } = useWorkspaceListQuery(memberId ?? 0);
  const workspaces = workspacesResponse?.workspaceResponses ?? [];
  const activeWorkspaceId: number = Number(location.pathname.split('/')[2] || '-1');
  const activeWorkspace = workspaces.filter((workspace) => workspace.id === activeWorkspaceId)[0] ?? null;

  const handleCreateWorkspace = (values: WorkSpaceCreateFormValues) => {
    const data: WorkspaceRequest = {
      title: values.workspaceName,
      content: values.workspaceDescription || '',
    };

    createWorkspace.mutate({
      memberId,
      data,
    });

    setIsOpenWorkspaceCreate(false);
  };

  const handleUpdateWorkspace = (values: WorkspaceUpdateFormValues) => {
    const data: WorkspaceRequest = {
      title: values.workspaceName,
      content: values.workspaceDescription || '',
    };

    updateWorkspace.mutate({
      workspaceId: activeWorkspaceId,
      memberId,
      data,
    });

    setIsOpenWorkspaceUpdate(false);
    refetch();
  };

  const handleCreateProject = (values: ProjectCreateFormValues) => {
    const data: ProjectRequest = {
      title: values.projectName,
      projectType: values.labelType.toLowerCase() as ProjectRequest['projectType'],
      categories: values.categories,
    };

    createProject.mutate({
      workspaceId: activeWorkspaceId,
      memberId,
      data,
    });

    setIsOpenProjectCreate(false);
  };

  useEffect(() => {
    refetch();
  }, [isOpenWorkspaceUpdate, refetch]);

  return (
    <>
      <Header />

      <div className="flex min-h-screen flex-col justify-between">
        <div className="mt-16 flex flex-1">
          <div className="flex w-[280px] flex-col gap-1 border-r border-gray-200 bg-gray-100 p-2">
            <div className="flex items-center justify-center gap-5">
              <h1 className="subheading mr-2.5 w-full overflow-hidden text-ellipsis whitespace-nowrap p-2">
                내 워크스페이스
              </h1>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="rounded-full p-2 duration-200 hover:bg-gray-200">
                    <Ellipsis size={16} />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsOpenWorkspaceCreate(true)}>
                    새 워크스페이스 추가
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col">
              {workspaces.length > 0 ? (
                workspaces.map((workspace: WorkspaceResponse) => (
                  <NavLink
                    key={workspace.id}
                    to={`/browse/${workspace.id}`}
                    className={({ isActive }) =>
                      cn('cursor-pointer rounded-lg hover:bg-gray-200', isActive ? 'body-strong bg-gray-200' : 'body')
                    }
                  >
                    <div className="flex items-center justify-center">
                      <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap p-3">{workspace.title}</p>
                      {workspace.id === activeWorkspaceId && (
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <div className="mr-1 rounded-full p-2 duration-200 hover:bg-gray-300">
                              <Ellipsis size={16} />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setIsOpenWorkspaceUpdate(true)}>
                              워크스페이스 이름 변경
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsOpenProjectCreate(true)}>
                              워크스페이스에 새 프로젝트 추가
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </NavLink>
                ))
              ) : (
                <p className="p-2 text-gray-500">워크스페이스가 없습니다.</p>
              )}
            </div>
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

      <Dialog
        open={isOpenWorkspaceCreate}
        onOpenChange={setIsOpenWorkspaceCreate}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogHeader title="새 워크스페이스 추가" />
          <WorkSpaceCreateForm onSubmit={handleCreateWorkspace} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isOpenWorkspaceUpdate}
        onOpenChange={setIsOpenWorkspaceUpdate}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogHeader title="워크스페이스 이름 변경" />
          <WorkspaceUpdateForm
            workspace={activeWorkspace}
            onSubmit={handleUpdateWorkspace}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isOpenProjectCreate}
        onOpenChange={setIsOpenProjectCreate}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogHeader title="새 프로젝트 추가" />
          <ProjectCreateForm onSubmit={handleCreateProject} />
        </DialogContent>
      </Dialog>
    </>
  );
}
