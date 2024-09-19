// TODO: 훅 재설계
// import { useQuery } from '@tanstack/react-query';
// import { getWorkspace, getWorkspaceList } from '@/api/workspaceApi';

// export const useGetWorkspace = (workspaceId: number, memberId: number) => {
//   return useQuery({
//     queryKey: ['workspace', workspaceId],
//     queryFn: () => getWorkspace(workspaceId, memberId),
//   });
// };

// export const useGetWorkspaceList = (memberId: number, lastWorkspaceId?: number, limit?: number) => {
//   return useQuery({
//     queryKey: ['workspaces'],
//     queryFn: () => getWorkspaceList(memberId, lastWorkspaceId, limit),
//   });
// };

// TODO: 수정된 쿼리에 맞게 훅 수정
// export const useUpdateWorkspace = (): UseMutationResult<
//   BaseResponse<WorkspaceResponse>,
//   AxiosError<CustomError>,
//   { workspaceId: number; memberId: number; data: { title: string; content: string } }
// > => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ workspaceId, memberId, data }) => updateWorkspace(workspaceId, memberId, data),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });
//     },
//   });
// };

// export const useDeleteWorkspace = (): UseMutationResult<
//   BaseResponse<null>,
//   AxiosError<CustomError>,
//   { workspaceId: number; memberId: number }
// > => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ workspaceId, memberId }) => deleteWorkspace(workspaceId, memberId),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });
//     },
//   });
// };

// export const useCreateWorkspace = (): UseMutationResult<
//   BaseResponse<WorkspaceResponse>,
//   AxiosError<CustomError>,
//   { memberId: number; data: { title: string; content: string } }
// > => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ memberId, data }) => createWorkspace(memberId, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['workspaces'] });
//     },
//   });
// };

// export const useAddWorkspaceMember = (): UseMutationResult<
//   BaseResponse<null>,
//   AxiosError<CustomError>,
//   { workspaceId: number; memberId: number; newMemberId: number }
// > => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ workspaceId, memberId, newMemberId }) => addWorkspaceMember(workspaceId, memberId, newMemberId),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });
//     },
//   });
// };

// export const useRemoveWorkspaceMember = (): UseMutationResult<
//   BaseResponse<null>,
//   AxiosError<CustomError>,
//   { workspaceId: number; memberId: number; targetMemberId: number }
// > => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ workspaceId, memberId, targetMemberId }) =>
//       removeWorkspaceMember(workspaceId, memberId, targetMemberId),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });
//     },
//   });
// };

// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import {
//   createWorkspace,
//   updateWorkspace,
//   deleteWorkspace,
//   addWorkspaceMember,
//   removeWorkspaceMember,
// } from '@/api/workspaceApi';
// import { WorkspaceResponse, WorkspaceRequest } from '@/types';

// export const useCreateWorkspace = () => {
//   const queryClient = useQueryClient();

//   return useMutation<WorkspaceResponse, Error, { memberId: number; data: WorkspaceRequest }>({
//     mutationFn: ({ memberId, data }) => createWorkspace(memberId, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['workspaceList'] });
//     },
//   });
// };

// export const useUpdateWorkspace = () => {
//   const queryClient = useQueryClient();

//   return useMutation<WorkspaceResponse, Error, { workspaceId: number; memberId: number; data: WorkspaceRequest }>({
//     mutationFn: ({ workspaceId, memberId, data }) => updateWorkspace(workspaceId, memberId, data),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });
//     },
//   });
// };

// export const useDeleteWorkspace = () => {
//   const queryClient = useQueryClient();

//   return useMutation<void, Error, { workspaceId: number; memberId: number }>({
//     mutationFn: ({ workspaceId, memberId }) => deleteWorkspace(workspaceId, memberId),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });
//     },
//   });
// };

// export const useAddWorkspaceMember = () => {
//   const queryClient = useQueryClient();

//   return useMutation<void, Error, { workspaceId: number; memberId: number; newMemberId: number }>({
//     mutationFn: ({ workspaceId, memberId, newMemberId }) => addWorkspaceMember(workspaceId, memberId, newMemberId),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });
//     },
//   });
// };

// export const useRemoveWorkspaceMember = () => {
//   const queryClient = useQueryClient();

//   return useMutation<void, Error, { workspaceId: number; memberId: number; targetMemberId: number }>({
//     mutationFn: ({ workspaceId, memberId, targetMemberId }) =>
//       removeWorkspaceMember(workspaceId, memberId, targetMemberId),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });
//     },
//   });
// };
