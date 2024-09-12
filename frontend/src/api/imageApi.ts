import api from '@/api/axiosConfig';
import { AxiosError } from 'axios';
import { ImageResponseDTO, ImageMoveRequestDTO, ImageStatusChangeRequestDTO, BaseResponse } from '@/types';

export const fetchImageApi = async (
  projectId: number,
  folderId: number,
  imageId: number,
  memberId: number
): Promise<BaseResponse<ImageResponseDTO>> => {
  try {
    const response = await api.get(`/api/projects/${projectId}/folders/${folderId}/images/${imageId}`, {
      params: { memberId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('이미지 조회 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const moveImageApi = async (
  projectId: number,
  folderId: number,
  imageId: number,
  memberId: number,
  moveRequest: ImageMoveRequestDTO
): Promise<BaseResponse<null>> => {
  try {
    const response = await api.put(`/api/projects/${projectId}/folders/${folderId}/images/${imageId}`, moveRequest, {
      params: { memberId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('이미지 폴더 이동 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const deleteImageApi = async (
  projectId: number,
  folderId: number,
  imageId: number,
  memberId: number
): Promise<BaseResponse<null>> => {
  try {
    const response = await api.delete(`/api/projects/${projectId}/folders/${folderId}/images/${imageId}`, {
      params: { memberId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('이미지 삭제 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const changeImageStatusApi = async (
  projectId: number,
  folderId: number,
  imageId: number,
  memberId: number,
  statusChangeRequest: ImageStatusChangeRequestDTO
): Promise<BaseResponse<ImageResponseDTO>> => {
  try {
    const response = await api.put(
      `/api/projects/${projectId}/folders/${folderId}/images/${imageId}/status`,
      statusChangeRequest,
      {
        params: { memberId },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('이미지 상태 변경 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const uploadImageListApi = async (
  projectId: number,
  folderId: number,
  memberId: number,
  imageList: string[]
): Promise<BaseResponse<null>> => {
  try {
    const response = await api.post(
      `/api/projects/${projectId}/folders/${folderId}/images`,
      { imageList },
      {
        params: { memberId },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('이미지 목록 업로드 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};
