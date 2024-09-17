import api from '@/api/axiosConfig';
import { WorkspaceListResponse, WorkspaceRequest, WorkspaceResponse } from '@/types';

export async function getWorkspaceList(memberId: number, lastWorkspaceId?: number, limit?: number) {
  return api
    .get<WorkspaceListResponse>('/workspaces', {
      params: { memberId, lastWorkspaceId, limit },
    })
    .then(({ data }) => data);
}

export async function getWorkspace(workspaceId: number, memberId: number) {
  return api
    .get<WorkspaceResponse>(`/workspaces/${workspaceId}`, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

export async function updateWorkspace(workspaceId: number, memberId: number, data: WorkspaceRequest) {
  return api
    .put(`/workspaces/${workspaceId}`, data, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

export async function deleteWorkspace(workspaceId: number, memberId: number) {
  return api
    .delete(`/workspaces/${workspaceId}`, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

export async function createWorkspace(memberId: number, data: WorkspaceRequest) {
  return api
    .post('/workspaces', data, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

export async function addWorkspaceMember(workspaceId: number, memberId: number, newMemberId: number) {
  return api
    .post(`/workspaces/${workspaceId}/members/${newMemberId}`, null, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

export async function removeWorkspaceMember(workspaceId: number, memberId: number, targetMemberId: number) {
  return api
    .delete(`/workspaces/${workspaceId}/members/${targetMemberId}`, {
      params: { memberId },
    })
    .then(({ data }) => data);
}
