import api from '@/api/axiosConfig';
import { FolderRequest, FolderResponse } from '@/types';

export async function fetchFolder(projectId: number, folderId: number, memberId: number) {
  return api
    .get<FolderResponse>(`/projects/${projectId}/folders/${folderId}`, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

export async function updateFolder(projectId: number, folderId: number, memberId: number, folderData: FolderRequest) {
  return api
    .put(`/projects/${projectId}/folders/${folderId}`, folderData, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

export async function deleteFolder(projectId: number, folderId: number, memberId: number) {
  return api
    .delete(`/projects/${projectId}/folders/${folderId}`, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

export async function createFolder(projectId: number, memberId: number, folderData: FolderRequest) {
  return api
    .post(`/projects/${projectId}/folders`, folderData, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

export async function getFolderReviewList(projectId: number, folderId: number, memberId: number) {
  return api
    .get(`/projects/${projectId}/folders/${folderId}/review`, {
      params: { memberId },
    })
    .then(({ data }) => data);
}
