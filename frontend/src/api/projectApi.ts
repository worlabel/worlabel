import api from '@/api/axiosConfig';

export async function getProjectApi(projectId: number, memberId: number) {
  return api.get(`/projects/${projectId}`, {
    params: { memberId },
  });
}

export async function updateProjectApi(
  projectId: number,
  memberId: number,
  data: { title: string; projectType: 'classification' | 'detection' | 'segmentation' }
) {
  return api.put(`/projects/${projectId}`, data, {
    params: { memberId },
  });
}

export async function deleteProjectApi(projectId: number, memberId: number) {
  return api.delete(`/projects/${projectId}`, {
    params: { memberId },
  });
}

export async function addProjectMemberApi(
  projectId: number,
  memberId: number,
  newMemberId: number,
  privilegeType: string
) {
  return api.post(
    `/projects/${projectId}/members`,
    { memberId: newMemberId, privilegeType },
    {
      params: { memberId },
    }
  );
}

export async function removeProjectMemberApi(projectId: number, memberId: number, targetMemberId: number) {
  return api.delete(`/projects/${projectId}/members`, {
    params: { memberId },
    data: { memberId: targetMemberId },
  });
}

export async function getAllProjectsApi(
  workspaceId: number,
  memberId: number,
  lastProjectId?: number,
  limit: number = 10
) {
  return api.get(`/workspaces/${workspaceId}/projects`, {
    params: {
      memberId,
      lastProjectId,
      limit,
    },
  });
}

export async function createProjectApi(
  workspaceId: number,
  memberId: number,
  data: { title: string; projectType: 'classification' | 'detection' | 'segmentation' }
) {
  return api.post(`/workspaces/${workspaceId}/projects`, data, {
    params: { memberId },
  });
}
