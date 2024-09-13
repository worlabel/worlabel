import api from '@/api/axiosConfig';
import { WorkspaceRequestDTO } from '@/types';

export async function fetchWorkspaceList(memberId: number, lastWorkspaceId?: number, limit?: number) {
  return api.get('/workspaces', {
    params: { memberId, lastWorkspaceId, limit },
  });
}

export async function fetchWorkspace(workspaceId: number, memberId: number) {
  return api.get(`/workspaces/${workspaceId}`, {
    params: { memberId },
  });
}

export async function updateWorkspace(workspaceId: number, memberId: number, data: WorkspaceRequestDTO) {
  return api.put(`/workspaces/${workspaceId}`, data, {
    params: { memberId },
  });
}

export async function deleteWorkspace(workspaceId: number, memberId: number) {
  return api.delete(`/workspaces/${workspaceId}`, {
    params: { memberId },
  });
}

export async function createWorkspace(memberId: number, data: WorkspaceRequestDTO) {
  return api.post('/workspaces', data, {
    params: { memberId },
  });
}

export async function addWorkspaceMember(workspaceId: number, memberId: number, newMemberId: number) {
  return api.post(`/workspaces/${workspaceId}/members/${newMemberId}`, null, {
    params: { memberId },
  });
}

export async function removeWorkspaceMember(workspaceId: number, memberId: number, targetMemberId: number) {
  return api.delete(`/workspaces/${workspaceId}/members/${targetMemberId}`, {
    params: { memberId },
  });
}
