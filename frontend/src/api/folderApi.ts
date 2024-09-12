import api from '@/api/axiosConfig';
import { AxiosError } from 'axios';
import { FolderResponseDTO, FolderRequestDTO, BaseResponse } from '@/types';

export const fetchFolderApi = async (
  projectId: number,
  folderId: number,
  memberId: number
): Promise<BaseResponse<FolderResponseDTO>> => {
  try {
    const response = await api.get(`/api/projects/${projectId}/folders/${folderId}`, {
      params: { memberId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('폴더 조회 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const updateFolderApi = async (
  projectId: number,
  folderId: number,
  memberId: number,
  folderData: FolderRequestDTO
): Promise<BaseResponse<FolderResponseDTO>> => {
  try {
    const response = await api.put(`/api/projects/${projectId}/folders/${folderId}`, folderData, {
      params: { memberId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('폴더 수정 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const deleteFolderApi = async (
  projectId: number,
  folderId: number,
  memberId: number
): Promise<BaseResponse<FolderResponseDTO>> => {
  try {
    const response = await api.delete(`/api/projects/${projectId}/folders/${folderId}`, {
      params: { memberId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('폴더 삭제 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const createFolderApi = async (
  projectId: number,
  memberId: number,
  folderData: FolderRequestDTO
): Promise<BaseResponse<FolderResponseDTO>> => {
  try {
    const response = await api.post(`/api/projects/${projectId}/folders`, folderData, {
      params: { memberId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('폴더 생성 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const fetchFolderReviewListApi = async (
  projectId: number,
  folderId: number,
  memberId: number
): Promise<BaseResponse<FolderResponseDTO>> => {
  try {
    const response = await api.get(`/api/projects/${projectId}/folders/${folderId}/review`, {
      params: { memberId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('리뷰해야 할 폴더 목록 조회 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};
