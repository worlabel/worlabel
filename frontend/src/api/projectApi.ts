import api from '@/api/axiosConfig';

export async function getProject(projectId: number, memberId: number) {
  return api
    .get(`/projects/${projectId}`, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

export async function updateProject(
  projectId: number,
  memberId: number,
  data: { title: string; projectType: 'classification' | 'detection' | 'segmentation' }
) {
  return api
    .put(`/projects/${projectId}`, data, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

export async function deleteProject(projectId: number, memberId: number) {
  return api
    .delete(`/projects/${projectId}`, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

export async function addProjectMember(
  projectId: number,
  memberId: number,
  newMemberId: number,
  privilegeType: string
) {
  return api
    .post(
      `/projects/${projectId}/members`,
      { memberId: newMemberId, privilegeType },
      {
        params: { memberId },
      }
    )
    .then(({ data }) => data);
}

export async function removeProjectMember(projectId: number, memberId: number, targetMemberId: number) {
  return api
    .delete(`/projects/${projectId}/members`, {
      params: { memberId },
      data: { memberId: targetMemberId },
    })
    .then(({ data }) => data);
}

export async function getAllProjects(
  workspaceId: number,
  memberId: number,
  lastProjectId?: number,
  limit: number = 10
) {
  return api
    .get(`/workspaces/${workspaceId}/projects`, {
      params: {
        memberId,
        lastProjectId,
        limit,
      },
    })
    .then(({ data }) => data);
}

export async function createProject(
  workspaceId: number,
  memberId: number,
  data: { title: string; projectType: 'classification' | 'detection' | 'segmentation' }
) {
  return api
    .post(`/workspaces/${workspaceId}/projects`, data, {
      params: { memberId },
    })
    .then(({ data }) => data);
}
