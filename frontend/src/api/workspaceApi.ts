import api from '@/api/axiosConfig';
import { AxiosError, AxiosResponse } from 'axios';
import { BaseResponse, WorkspaceRequestDTO, WorkspaceResponseDTO, WorkspaceListResponseDTO } from '@/types';

export const getWorkspaceApi = async (
  workspaceId: number,
  memberId: number
): Promise<BaseResponse<WorkspaceResponseDTO>> => {
  try {
    const response: AxiosResponse<BaseResponse<WorkspaceResponseDTO>> = await api.get(
      `/api/workspaces/${workspaceId}`,
      {
        params: { memberId },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API 요청 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const updateWorkspaceApi = async (
  workspaceId: number,
  memberId: number,
  data: WorkspaceRequestDTO
): Promise<BaseResponse<WorkspaceResponseDTO>> => {
  try {
    const response: AxiosResponse<BaseResponse<WorkspaceResponseDTO>> = await api.put(
      `/api/workspaces/${workspaceId}`,
      data,
      {
        params: { memberId },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API 요청 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const deleteWorkspaceApi = async (workspaceId: number, memberId: number): Promise<BaseResponse<null>> => {
  try {
    const response: AxiosResponse<BaseResponse<null>> = await api.delete(`/api/workspaces/${workspaceId}`, {
      params: { memberId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API 요청 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const getAllWorkspacesApi = async (
  memberId: number,
  lastWorkspaceId?: number,
  limit?: number
): Promise<BaseResponse<WorkspaceListResponseDTO>> => {
  try {
    const response: AxiosResponse<BaseResponse<WorkspaceListResponseDTO>> = await api.get('/api/workspaces', {
      params: { memberId, lastWorkspaceId, limit },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API 요청 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const createWorkspaceApi = async (
  memberId: number,
  data: WorkspaceRequestDTO
): Promise<BaseResponse<WorkspaceResponseDTO>> => {
  try {
    const response: AxiosResponse<BaseResponse<WorkspaceResponseDTO>> = await api.post('/api/workspaces', data, {
      params: { memberId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API 요청 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const addWorkspaceMemberApi = async (
  workspaceId: number,
  memberId: number,
  newMemberId: number
): Promise<BaseResponse<null>> => {
  try {
    const response: AxiosResponse<BaseResponse<null>> = await api.post(
      `/api/workspaces/${workspaceId}/members/${newMemberId}`,
      null,
      {
        params: { memberId },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API 요청 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const removeWorkspaceMemberApi = async (
  workspaceId: number,
  memberId: number,
  targetMemberId: number
): Promise<BaseResponse<null>> => {
  try {
    const response: AxiosResponse<BaseResponse<null>> = await api.delete(
      `/api/workspaces/${workspaceId}/members/${targetMemberId}`,
      {
        params: { memberId },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API 요청 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};
