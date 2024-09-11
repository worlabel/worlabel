import { useQuery, UseQueryResult, useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  getWorkspaceApi,
  updateWorkspaceApi,
  deleteWorkspaceApi,
  getAllWorkspacesApi,
  createWorkspaceApi,
  addWorkspaceMemberApi,
  removeWorkspaceMemberApi,
} from '@/api/workspaceApi';

interface WorkspaceResponse {
  status: number;
  code: number;
  message: string;
  data: {
    id: number;
    memberId: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  };
  errors: Array<{
    field: string;
    code: string;
    message: string;
    objectName: string;
  }>;
  isSuccess: boolean;
}
interface Workspace {
  id: number;
  memberId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface GetAllWorkspacesResponse {
  status: number;
  code: number;
  message: string;
  data: {
    workspaceResponses: Workspace[];
  };
  errors: Array<{
    field: string;
    code: string;
    message: string;
    objectName: string;
  }>;
  isSuccess: boolean;
}

interface ErrorResponse {
  message: string;
}

export const useGetWorkspace = (
  workspaceId: number,
  memberId: number
): UseQueryResult<WorkspaceResponse, AxiosError<ErrorResponse>> => {
  return useQuery<WorkspaceResponse, AxiosError<ErrorResponse>>({
    queryKey: ['workspace', workspaceId],
    queryFn: () => getWorkspaceApi(workspaceId, memberId),
  });
};

export const useUpdateWorkspace = (): UseMutationResult<
  WorkspaceResponse,
  AxiosError<ErrorResponse>,
  { workspaceId: number; memberId: number; data: { title: string; content: string } }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, memberId, data }) => updateWorkspaceApi(workspaceId, memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace'] });
    },
  });
};

export const useDeleteWorkspace = (): UseMutationResult<
  WorkspaceResponse,
  AxiosError<ErrorResponse>,
  { workspaceId: number; memberId: number }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, memberId }) => deleteWorkspaceApi(workspaceId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace'] });
    },
  });
};

export const useGetAllWorkspaces = (
  memberId: number,
  lastWorkspaceId?: number,
  limit?: number
): UseQueryResult<GetAllWorkspacesResponse, AxiosError<ErrorResponse>> => {
  return useQuery<GetAllWorkspacesResponse, AxiosError<ErrorResponse>>({
    queryKey: ['workspaces'],
    queryFn: () => getAllWorkspacesApi(memberId, lastWorkspaceId, limit),
  });
};

export const useCreateWorkspace = (): UseMutationResult<
  WorkspaceResponse,
  AxiosError<ErrorResponse>,
  { memberId: number; data: { title: string; content: string } }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, data }) => createWorkspaceApi(memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace'] });
    },
  });
};

export const useAddWorkspaceMember = (): UseMutationResult<
  WorkspaceResponse,
  AxiosError<ErrorResponse>,
  { workspaceId: number; memberId: number; newMemberId: number }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, memberId, newMemberId }) => addWorkspaceMemberApi(workspaceId, memberId, newMemberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace'] });
    },
  });
};

export const useRemoveWorkspaceMember = (): UseMutationResult<
  WorkspaceResponse,
  AxiosError<ErrorResponse>,
  { workspaceId: number; memberId: number; targetMemberId: number }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, memberId, targetMemberId }) =>
      removeWorkspaceMemberApi(workspaceId, memberId, targetMemberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace'] });
    },
  });
};
