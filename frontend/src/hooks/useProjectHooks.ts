import { useQuery, UseQueryResult, useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  getProjectApi,
  updateProjectApi,
  deleteProjectApi,
  getAllProjectsApi,
  createProjectApi,
  addProjectMemberApi,
  removeProjectMemberApi,
} from '@/api/projectApi';
import { BaseResponse, ProjectResponseDTO, ProjectListResponseDTO, CustomError } from '@/types';

export const useGetProject = (
  projectId: number,
  memberId: number
): UseQueryResult<BaseResponse<ProjectResponseDTO>, AxiosError<CustomError>> => {
  return useQuery<BaseResponse<ProjectResponseDTO>, AxiosError<CustomError>>({
    queryKey: ['project', projectId],
    queryFn: () => getProjectApi(projectId, memberId),
  });
};

export const useUpdateProject = (): UseMutationResult<
  BaseResponse<ProjectResponseDTO>,
  AxiosError<CustomError>,
  {
    projectId: number;
    memberId: number;
    data: { title: string; projectType: 'classification' | 'detection' | 'segmentation' };
  }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberId, data }) => updateProjectApi(projectId, memberId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project', data.data.id] });
    },
  });
};

export const useDeleteProject = (): UseMutationResult<
  BaseResponse<null>,
  AxiosError<CustomError>,
  { projectId: number; memberId: number }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberId }) => deleteProjectApi(projectId, memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
};

export const useGetAllProjects = (
  workspaceId: number,
  memberId: number,
  options?: { enabled: boolean }
): UseQueryResult<BaseResponse<ProjectListResponseDTO>, AxiosError<CustomError>> => {
  return useQuery<BaseResponse<ProjectListResponseDTO>, AxiosError<CustomError>>({
    queryKey: ['projects', workspaceId],
    queryFn: () => getAllProjectsApi(workspaceId, memberId),
    enabled: options?.enabled,
  });
};

export const useCreateProject = (): UseMutationResult<
  BaseResponse<ProjectResponseDTO>,
  AxiosError<CustomError>,
  {
    workspaceId: number;
    memberId: number;
    data: { title: string; projectType: 'classification' | 'detection' | 'segmentation' };
  }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, memberId, data }) => createProjectApi(workspaceId, memberId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.workspaceId] });
    },
  });
};

export const useAddProjectMember = (): UseMutationResult<
  BaseResponse<null>,
  AxiosError<CustomError>,
  { projectId: number; memberId: number; newMemberId: number; privilegeType: string }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberId, newMemberId, privilegeType }) =>
      addProjectMemberApi(projectId, memberId, newMemberId, privilegeType),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
};

export const useRemoveProjectMember = (): UseMutationResult<
  BaseResponse<null>,
  AxiosError<CustomError>,
  { projectId: number; memberId: number; targetMemberId: number }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberId, targetMemberId }) =>
      removeProjectMemberApi(projectId, memberId, targetMemberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
};
