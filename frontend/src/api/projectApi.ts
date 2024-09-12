import api from '@/api/axiosConfig';
import { AxiosError, AxiosResponse } from 'axios';
import { BaseResponse, ProjectResponseDTO, ProjectListResponseDTO } from '@/types';

export const getProjectApi = async (projectId: number, memberId: number): Promise<BaseResponse<ProjectResponseDTO>> => {
  try {
    const response: AxiosResponse<BaseResponse<ProjectResponseDTO>> = await api.get(`/api/projects/${projectId}`, {
      params: { memberId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('프로젝트 조회 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const updateProjectApi = async (
  projectId: number,
  memberId: number,
  data: { title: string; projectType: 'classification' | 'detection' | 'segmentation' }
): Promise<BaseResponse<ProjectResponseDTO>> => {
  try {
    const response: AxiosResponse<BaseResponse<ProjectResponseDTO>> = await api.put(
      `/api/projects/${projectId}`,
      data,
      {
        params: { memberId },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('프로젝트 수정 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const deleteProjectApi = async (projectId: number, memberId: number): Promise<BaseResponse<null>> => {
  try {
    const response: AxiosResponse<BaseResponse<null>> = await api.delete(`/api/projects/${projectId}`, {
      params: { memberId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('프로젝트 삭제 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const addProjectMemberApi = async (
  projectId: number,
  memberId: number,
  newMemberId: number,
  privilegeType: string
): Promise<BaseResponse<null>> => {
  try {
    const response: AxiosResponse<BaseResponse<null>> = await api.post(
      `/api/projects/${projectId}/members`,
      { memberId: newMemberId, privilegeType },
      {
        params: { memberId },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('프로젝트 멤버 추가 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const removeProjectMemberApi = async (
  projectId: number,
  memberId: number,
  targetMemberId: number
): Promise<BaseResponse<null>> => {
  try {
    const response: AxiosResponse<BaseResponse<null>> = await api.delete(`/api/projects/${projectId}/members`, {
      params: { memberId },
      data: { memberId: targetMemberId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('프로젝트 멤버 제거 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const getAllProjectsApi = async (
  workspaceId: number,
  memberId: number,
  lastProjectId?: number,
  limit: number = 10
): Promise<BaseResponse<ProjectListResponseDTO>> => {
  try {
    const response: AxiosResponse<BaseResponse<ProjectListResponseDTO>> = await api.get(
      `/api/workspaces/${workspaceId}/projects`,
      {
        params: {
          memberId,
          lastProjectId,
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('프로젝트 목록 조회 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const createProjectApi = async (
  workspaceId: number,
  memberId: number,
  data: { title: string; projectType: 'classification' | 'detection' | 'segmentation' }
): Promise<BaseResponse<ProjectResponseDTO>> => {
  try {
    const response: AxiosResponse<BaseResponse<ProjectResponseDTO>> = await api.post(
      `/api/workspaces/${workspaceId}/projects`,
      data,
      {
        params: { memberId },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('프로젝트 생성 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};
