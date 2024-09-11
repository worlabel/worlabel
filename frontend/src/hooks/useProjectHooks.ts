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

interface Project {
  id: number;
  title: string;
  workspaceId: number;
  projectType: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsResponse {
  status: number;
  code: number;
  message: string;
  data: {
    workspaceResponses: Project[];
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

export const useGetProject = (
  projectId: number,
  memberId: number
): UseQueryResult<ProjectsResponse, AxiosError<ErrorResponse>> => {
  return useQuery<ProjectsResponse, AxiosError<ErrorResponse>>({
    queryKey: ['project', projectId],
    queryFn: () => getProjectApi(projectId, memberId),
  });
};

export const useUpdateProject = (): UseMutationResult<
  ProjectsResponse,
  AxiosError<ErrorResponse>,
  { projectId: number; memberId: number; data: { title: string; projectType: string } }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberId, data }) => updateProjectApi(projectId, memberId, data),
    onSuccess: (data) => {
      const project = data.data?.workspaceResponses?.[0];
      if (project) {
        queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      } else {
        console.error('프로젝트 데이터가 없습니다.');
      }
    },
  });
};

export const useDeleteProject = (): UseMutationResult<
  ProjectsResponse,
  AxiosError<ErrorResponse>,
  { projectId: number; memberId: number }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberId }) => deleteProjectApi(projectId, memberId),
    onSuccess: (data) => {
      const project = data.data?.workspaceResponses?.[0];
      if (project) {
        queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      } else {
        console.error('프로젝트 데이터가 없습니다.');
      }
    },
  });
};

export const useGetAllProjects = (
  workspaceId: number,
  memberId: number,
  lastProjectId?: number,
  limit: number = 10
): UseQueryResult<ProjectsResponse, AxiosError<ErrorResponse>> => {
  return useQuery<ProjectsResponse, AxiosError<ErrorResponse>>({
    queryKey: ['projects', workspaceId],
    queryFn: () => getAllProjectsApi(workspaceId, memberId, lastProjectId, limit),
  });
};

export const useCreateProject = (): UseMutationResult<
  ProjectsResponse,
  AxiosError<ErrorResponse>,
  { workspaceId: number; memberId: number; data: { title: string; projectType: string } }
> => {
  return useMutation({
    mutationFn: ({ workspaceId, memberId, data }) => createProjectApi(workspaceId, memberId, data),
  });
};

export const useAddProjectMember = (): UseMutationResult<
  ProjectsResponse,
  AxiosError<ErrorResponse>,
  { projectId: number; memberId: number; newMemberId: number; privilegeType: string }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberId, newMemberId, privilegeType }) =>
      addProjectMemberApi(projectId, memberId, newMemberId, privilegeType),
    onSuccess: (data) => {
      const project = data.data?.workspaceResponses?.[0];
      if (project) {
        queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      } else {
        console.error('프로젝트 데이터가 없습니다.');
      }
    },
  });
};

export const useRemoveProjectMember = (): UseMutationResult<
  ProjectsResponse,
  AxiosError<ErrorResponse>,
  { projectId: number; memberId: number; targetMemberId: number }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberId, targetMemberId }) =>
      removeProjectMemberApi(projectId, memberId, targetMemberId),
    onSuccess: (data) => {
      const project = data.data?.workspaceResponses?.[0];
      if (project) {
        queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      } else {
        console.error('프로젝트 데이터가 없습니다.');
      }
    },
  });
};
