// TODO: 훅 재설계
// import { useQuery, UseQueryResult, useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
// import { AxiosError } from 'axios';
// import {
//   getProject,
//   updateProject,
//   deleteProject,
//   getAllProjects,
//   createProject,
//   addProjectMember,
//   removeProjectMember,
// } from '@/api/projectApi';
// import { BaseResponse, ProjectResponse, ProjectListResponse, CustomError } from '@/types';

// export const useGetProject = (
//   projectId: number,
//   memberId: number
// ): UseQueryResult<BaseResponse<ProjectResponse>, AxiosError<CustomError>> => {
//   return useQuery<BaseResponse<ProjectResponse>, AxiosError<CustomError>>({
//     queryKey: ['project', projectId],
//     queryFn: () => getProject(projectId, memberId),
//   });
// };

// export const useUpdateProject = (): UseMutationResult<
//   BaseResponse<ProjectResponse>,
//   AxiosError<CustomError>,
//   {
//     projectId: number;
//     memberId: number;
//     data: { title: string; projectType: 'classification' | 'detection' | 'segmentation' };
//   }
// > => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ projectId, memberId, data }) => updateProject(projectId, memberId, data),
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ['project', data.data.id] });
//     },
//   });
// };

// export const useDeleteProject = (): UseMutationResult<
//   BaseResponse<null>,
//   AxiosError<CustomError>,
//   { projectId: number; memberId: number }
// > => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ projectId, memberId }) => deleteProject(projectId, memberId),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
//     },
//   });
// };

// export const useGetAllProjects = (
//   workspaceId: number,
//   memberId: number,
//   options?: { enabled: boolean }
// ): UseQueryResult<BaseResponse<ProjectListResponse>, AxiosError<CustomError>> => {
//   return useQuery<BaseResponse<ProjectListResponse>, AxiosError<CustomError>>({
//     queryKey: ['projects', workspaceId],
//     queryFn: () => getAllProjects(workspaceId, memberId),
//     enabled: options?.enabled,
//   });
// };

// export const useCreateProject = (): UseMutationResult<
//   BaseResponse<ProjectResponse>,
//   AxiosError<CustomError>,
//   {
//     workspaceId: number;
//     memberId: number;
//     data: { title: string; projectType: 'classification' | 'detection' | 'segmentation' };
//   }
// > => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ workspaceId, memberId, data }) => createProject(workspaceId, memberId, data),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['projects', variables.workspaceId] });
//     },
//   });
// };

// export const useAddProjectMember = (): UseMutationResult<
//   BaseResponse<null>,
//   AxiosError<CustomError>,
//   { projectId: number; memberId: number; newMemberId: number; privilegeType: string }
// > => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ projectId, memberId, newMemberId, privilegeType }) =>
//       addProjectMember(projectId, memberId, newMemberId, privilegeType),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
//     },
//   });
// };

// export const useRemoveProjectMember = (): UseMutationResult<
//   BaseResponse<null>,
//   AxiosError<CustomError>,
//   { projectId: number; memberId: number; targetMemberId: number }
// > => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ projectId, memberId, targetMemberId }) => removeProjectMember(projectId, memberId, targetMemberId),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
//     },
//   });
// };
