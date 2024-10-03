import api from '@/api/axiosConfig';
import { ImageMoveRequest, ImageStatusChangeRequest, ImagePresignedUrlResponse } from '@/types';
import axios from 'axios';

export async function getImage(projectId: number, folderId: number, imageId: number) {
  return api.get(`/api/projects/${projectId}/folders/${folderId}/images/${imageId}`);
}

export async function moveImage(projectId: number, folderId: number, imageId: number, moveRequest: ImageMoveRequest) {
  return api.put(`/projects/${projectId}/folders/${folderId}/images/${imageId}`, moveRequest);
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

export async function uploadImageFolderFile(
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
    .post(`/projects/${projectId}/folders/${folderId}/images/folder`, formData, {
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

export async function uploadImagePresigned(
  memberId: number,
  projectId: number,
  folderId: number,
  files: File[],
  processCallback: (index: number) => void
) {
  // 업로드 시작 시간 기록
  const startTime = new Date().getTime();

  // 파일 메타데이터 생성
  const imageMetaList = files.map((file: File, index: number) => ({
    id: index,
    fileName: file.name,
  }));

  // 서버로부터 presigned URL 리스트 받아옴
  const { data: presignedUrlList }: { data: ImagePresignedUrlResponse[] } = await api.post(
    `/projects/${projectId}/folders/${folderId}/images/presigned`,
    imageMetaList,
    {
      params: { memberId },
    }
  );

  // 각 파일을 presigned URL에 맞춰서 업로드 (axios 직접 사용)
  for (const presignedUrlInfo of presignedUrlList) {
    const file = files[presignedUrlInfo.id];

    try {
      // S3 presigned URL로 개별 파일 업로드
      await axios.put(presignedUrlInfo.presignedUrl, file, {
        headers: {
          'Content-Type': file.type, // 파일의 타입 설정
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            processCallback(presignedUrlInfo.id); // 성공 시 진행 상황 업데이트
          }
        },
      });

      // 파일이 성공적으로 업로드되면 로그 출력
    } catch (error) {
      // 업로드 실패 시 로그 출력
      console.error(`업로드 실패: ${file.name}`, error);
    }
  }

  // 업로드 완료 시간 기록
  const endTime = new Date().getTime();

  // 소요 시간 계산 (초 단위로 변환)
  const durationInSeconds = (endTime - startTime) / 1000;

  // 소요 시간 콘솔 출력
  console.log(`모든 파일 업로드 완료. 총 소요 시간: ${durationInSeconds}초`);
}
