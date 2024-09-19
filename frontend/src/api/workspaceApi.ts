import api from '@/api/axiosConfig';
import { WorkspaceListResponse, WorkspaceRequest, WorkspaceResponse, ReviewResponse } from '@/types';

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

export async function getWorkspaceReviews(
  workspaceId: number,
  memberId: number,
  reviewStatus?: 'REQUESTED' | 'APPROVED' | 'REJECTED',
  lastReviewId?: number,
  limitPage: number = 10
) {
  return api
    .get<ReviewResponse[]>(`/workspaces/${workspaceId}/reviews`, {
      params: {
        memberId,
        limitPage,
        ...(reviewStatus ? { reviewStatus } : {}),
        ...(lastReviewId ? { lastReviewId } : {}),
      },
    })
    .then(({ data }) => data);
}
