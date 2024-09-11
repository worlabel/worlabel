import api from '@/api/axiosConfig';
import { AxiosError } from 'axios';

interface Workspace {
  id: number;
  memberId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
interface GetAllWorkspacesResponse {
  status: number;
  code: number;
  message: string;
  data: {
    workspaceResponses: Workspace[];
  };
  errors: Array<{
    field: string;
    code: string;
    message: string;
    objectName: string;
  }>;
  isSuccess: boolean;
}
export const getWorkspaceApi = async (workspaceId: number, memberId: number) => {
  try {
    const response = await api.get(`/api/workspaces/${workspaceId}`, {
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

export const updateWorkspaceApi = async (
  workspaceId: number,
  memberId: number,
  data: { title: string; content: string }
) => {
  try {
    const response = await api.put(`/api/workspaces/${workspaceId}`, data, {
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

export const deleteWorkspaceApi = async (workspaceId: number, memberId: number) => {
  try {
    const response = await api.delete(`/api/workspaces/${workspaceId}`, {
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
): Promise<GetAllWorkspacesResponse> => {
  try {
    const response = await api.get('/api/workspaces', {
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

export const createWorkspaceApi = async (memberId: number, data: { title: string; content: string }) => {
  try {
    const response = await api.post('/api/workspaces', data, {
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

export const addWorkspaceMemberApi = async (workspaceId: number, memberId: number, newMemberId: number) => {
  try {
    const response = await api.post(`/api/workspaces/${workspaceId}/members/${newMemberId}`, null, {
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

export const removeWorkspaceMemberApi = async (workspaceId: number, memberId: number, targetMemberId: number) => {
  try {
    const response = await api.delete(`/api/workspaces/${workspaceId}/members/${targetMemberId}`, {
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
