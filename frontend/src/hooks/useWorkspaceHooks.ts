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
import { BaseResponse, WorkspaceResponseDTO, WorkspaceListResponseDTO, CustomError } from '@/types';

export const useGetWorkspace = (
  workspaceId: number,
  memberId: number
): UseQueryResult<BaseResponse<WorkspaceResponseDTO>, AxiosError<CustomError>> => {
  return useQuery<BaseResponse<WorkspaceResponseDTO>, AxiosError<CustomError>>({
    queryKey: ['workspace', workspaceId],
    queryFn: () => getWorkspaceApi(workspaceId, memberId),
  });
};

export const useUpdateWorkspace = (): UseMutationResult<
  BaseResponse<WorkspaceResponseDTO>,
  AxiosError<CustomError>,
  { workspaceId: number; memberId: number; data: { title: string; content: string } }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, memberId, data }) => updateWorkspaceApi(workspaceId, memberId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });
    },
  });
};

export const useDeleteWorkspace = (): UseMutationResult<
  BaseResponse<null>,
  AxiosError<CustomError>,
  { workspaceId: number; memberId: number }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, memberId }) => deleteWorkspaceApi(workspaceId, memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });
    },
  });
};

export const useGetAllWorkspaces = (
  memberId: number,
  lastWorkspaceId?: number,
  limit?: number
): UseQueryResult<BaseResponse<WorkspaceListResponseDTO>, AxiosError<CustomError>> => {
  return useQuery<BaseResponse<WorkspaceListResponseDTO>, AxiosError<CustomError>>({
    queryKey: ['workspaces'],
    queryFn: () => getAllWorkspacesApi(memberId, lastWorkspaceId, limit),
  });
};

export const useCreateWorkspace = (): UseMutationResult<
  BaseResponse<WorkspaceResponseDTO>,
  AxiosError<CustomError>,
  { memberId: number; data: { title: string; content: string } }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, data }) => createWorkspaceApi(memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};

export const useAddWorkspaceMember = (): UseMutationResult<
  BaseResponse<null>,
  AxiosError<CustomError>,
  { workspaceId: number; memberId: number; newMemberId: number }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, memberId, newMemberId }) => addWorkspaceMemberApi(workspaceId, memberId, newMemberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });
    },
  });
};

export const useRemoveWorkspaceMember = (): UseMutationResult<
  BaseResponse<null>,
  AxiosError<CustomError>,
  { workspaceId: number; memberId: number; targetMemberId: number }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, memberId, targetMemberId }) =>
      removeWorkspaceMemberApi(workspaceId, memberId, targetMemberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });
    },
  });
};
