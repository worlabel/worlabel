import api from '@/api/axiosConfig';
import { FolderRequest, FolderResponse } from '@/types';

export async function getFolder(projectId: string, folderId: number) {
  return api.get<FolderResponse>(`/projects/${projectId}/folders/${folderId}`).then(({ data }) => data);
}
export async function updateFolder(projectId: number, folderId: number, folderData: FolderRequest) {
  return api.put(`/projects/${projectId}/folders/${folderId}`, folderData).then(({ data }) => data);
}

export async function deleteFolder(projectId: number, folderId: number, memberId: number) {
  return api
    .delete(`/projects/${projectId}/folders/${folderId}`, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

export async function createFolder(projectId: number, folderData: FolderRequest) {
  return api.post(`/projects/${projectId}/folders`, folderData).then(({ data }) => data);
}
export async function getFolderReviewList(projectId: number, folderId: number, memberId: number) {
  return api
    .get(`/projects/${projectId}/folders/${folderId}/review`, {
      params: { memberId },
    })
    .then(({ data }) => data);
}
