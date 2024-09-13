import api from '@/api/axiosConfig';
import { FolderRequestDTO } from '@/types';

export async function fetchFolder(projectId: number, folderId: number, memberId: number) {
  return api.get(`/projects/${projectId}/folders/${folderId}`, {
    params: { memberId },
  });
}

export async function updateFolder(
  projectId: number,
  folderId: number,
  memberId: number,
  folderData: FolderRequestDTO
) {
  return api.put(`/projects/${projectId}/folders/${folderId}`, folderData, {
    params: { memberId },
  });
}

export async function deleteFolder(projectId: number, folderId: number, memberId: number) {
  return api.delete(`/projects/${projectId}/folders/${folderId}`, {
    params: { memberId },
  });
}

export async function createFolder(projectId: number, memberId: number, folderData: FolderRequestDTO) {
  return api.post(`/projects/${projectId}/folders`, folderData, {
    params: { memberId },
  });
}

export async function fetchFolderReviewList(projectId: number, folderId: number, memberId: number) {
  return api.get(`/projects/${projectId}/folders/${folderId}/review`, {
    params: { memberId },
  });
}
