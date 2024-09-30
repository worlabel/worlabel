import api from '@/api/axiosConfig';
import { ImageMoveRequest, ImageStatusChangeRequest } from '@/types';

export async function getImage(imageId: number, memberId: number) {
  return api.get(`/images/${imageId}`, {
    params: { memberId },
  });
}

export async function moveImage(imageId: number, memberId: number, moveRequest: ImageMoveRequest) {
  return api.put(`/images/${imageId}`, moveRequest, {
    params: { memberId },
  });
}

export async function deleteImage(imageId: number, memberId: number) {
  return api.delete(`/images/${imageId}`, {
    params: { memberId },
  });
}

export async function changeImageStatus(
  imageId: number,
  memberId: number,
  statusChangeRequest: ImageStatusChangeRequest
) {
  return api
    .put(`/images/${imageId}/status`, statusChangeRequest, {
      params: { memberId },
    })
    .then(({ data }) => data);
}

export async function uploadImageFile(
  memberId: number,
  projectId: number,
  folderId: number,
  files: File[],
  processCallback: (progress: number) => void
) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('imageList', file);
  });

  return api
    .post(`/projects/${projectId}/folders/${folderId}/images/file`, formData, {
      params: { memberId },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          processCallback(progress);
        }
      },
    })
    .then(({ data }) => data);
}

export async function uploadImageFolder(
  memberId: number,
  projectId: number,
  folderId: number,
  files: File[],
  processCallback: (progress: number) => void
) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('imageList', file);
  });

  return api
    .post(`/projects/${projectId}/folders/${folderId}/images/file`, formData, {
      params: { memberId },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          processCallback(progress);
        }
      },
    })
    .then(({ data }) => data);
}

export async function uploadImageZip(
  memberId: number,
  projectId: number,
  folderId: number,
  file: File,
  processCallback: (progress: number) => void
) {
  const formData = new FormData();
  formData.append('folderZip', file);

  return api
    .post(`/projects/${projectId}/folders/${folderId}/images/zip`, formData, {
      params: { memberId },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          processCallback(progress);
        }
      },
    })
    .then(({ data }) => data);
}
