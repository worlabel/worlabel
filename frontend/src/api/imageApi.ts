import api from '@/api/axiosConfig';
import { ImageMoveRequestDTO, ImageStatusChangeRequestDTO } from '@/types';

export async function fetchImage(projectId: number, folderId: number, imageId: number, memberId: number) {
  return api.get(`/projects/${projectId}/folders/${folderId}/images/${imageId}`, {
    params: { memberId },
  });
}

export async function moveImage(
  projectId: number,
  folderId: number,
  imageId: number,
  memberId: number,
  moveRequest: ImageMoveRequestDTO
) {
  return api.put(`/projects/${projectId}/folders/${folderId}/images/${imageId}`, moveRequest, {
    params: { memberId },
  });
}

export async function deleteImage(projectId: number, folderId: number, imageId: number, memberId: number) {
  return api.delete(`/projects/${projectId}/folders/${folderId}/images/${imageId}`, {
    params: { memberId },
  });
}

export async function changeImageStatus(
  projectId: number,
  folderId: number,
  imageId: number,
  memberId: number,
  statusChangeRequest: ImageStatusChangeRequestDTO
) {
  return api.put(`/projects/${projectId}/folders/${folderId}/images/${imageId}/status`, statusChangeRequest, {
    params: { memberId },
  });
}

export async function uploadImageList(projectId: number, folderId: number, memberId: number, imageList: string[]) {
  return api.post(
    `/projects/${projectId}/folders/${folderId}/images`,
    { imageList },
    {
      params: { memberId },
    }
  );
}
