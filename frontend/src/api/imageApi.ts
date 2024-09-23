import api from '@/api/axiosConfig';
import { ImageMoveRequest, ImageStatusChangeRequest } from '@/types';

export async function getImage(projectId: number, folderId: number, imageId: number, memberId: number) {
  return api.get(`/projects/${projectId}/folders/${folderId}/images/${imageId}`, {
    params: { memberId },
  });
}

export async function moveImage(
  projectId: number,
  folderId: number,
  imageId: number,
  memberId: number,
  moveRequest: ImageMoveRequest
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
  statusChangeRequest: ImageStatusChangeRequest
) {
  return api
    .put(`/projects/${projectId}/folders/${folderId}/images/${imageId}/status`, statusChangeRequest, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

export async function uploadImageFile(memberId: number, projectId: number, folderId: number, files: File[]) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('imageList', file);
  });

  return api
    .post(`/projects/${projectId}/folders/${folderId}/images/file`, formData, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

export async function uploadImageFolder(memberId: number, projectId: number, files: File[]) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('folderZip', file);
  });

  return api
    .post(`/projects/${projectId}/folders/${0}/images/zip`, formData, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

export async function uploadImageZip(memberId: number, projectId: number, file: File) {
  const formData = new FormData();
  formData.append('folderZip', file);

  return api
    .post(`/projects/${projectId}/folders/${0}/images/zip`, formData, {
      params: { memberId },
    })
    .then(({ data }) => data);
}
