import api from '@/api/axiosConfig';
import { ProjectResponse, ProjectMemberRequest, ProjectMemberResponse } from '@/types';

export async function getProjectList(
  workspaceId: number,
  memberId: number,
  lastProjectId?: number,
  limitPage: number = 50
) {
  return api
    .get<ProjectResponse[]>(`/workspaces/${workspaceId}/projects`, {
      params: {
        memberId,
        lastProjectId,
        limitPage,
      },
    })
    .then(({ data }) => data);
}

export async function getProject(projectId: number, memberId: number) {
  return api
    .get<ProjectResponse>(`/projects/${projectId}`, {
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

// 프로젝트 멤버 조회
export async function getProjectMembers(projectId: number, memberId: number) {
  return api
    .get<ProjectMemberResponse[]>(`/projects/${projectId}/members`, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

// 프로젝트 멤버 추가
export async function addProjectMember(projectId: number, memberId: number, newMember: ProjectMemberRequest) {
  return api
    .post<ProjectMemberResponse>(`/projects/${projectId}/members`, newMember, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

// 프로젝트 멤버 권한 수정
export async function updateProjectMemberPrivilege(
  projectId: number,
  memberId: number,
  privilegeType: ProjectMemberResponse['privilegeType'] // 수정 가능한 권한 타입으로 변경
) {
  const privilegeData = {
    memberId,
    privilegeType,
  };

  return api.put<ProjectMemberResponse>(`/projects/${projectId}/members`, privilegeData).then(({ data }) => data);
}

// 프로젝트 멤버 삭제
export async function removeProjectMember(projectId: number, targetMemberId: number) {
  return api
    .delete(`/projects/${projectId}/members`, {
      data: targetMemberId,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => data);
}
