import api from '@/api/axiosConfig';
import { AxiosError, AxiosResponse } from 'axios';
import { BaseResponse } from '@/types';
import { LabelingRequestDTO } from '@/types';

export const saveImageLabelingApi = async (
  projectId: number,
  imageId: number,
  memberId: number,
  data: LabelingRequestDTO
): Promise<BaseResponse<Record<string, never>>> => {
  try {
    const response: AxiosResponse<BaseResponse<Record<string, never>>> = await api.post(
      `/api/projects/${projectId}/label/image/${imageId}`,
      data,
      {
        params: { memberId },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('이미지 레이블링 저장 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const autoLabelingApi = async (
  projectId: number,
  memberId: number
): Promise<BaseResponse<Record<string, never>>> => {
  try {
    const response: AxiosResponse<BaseResponse<Record<string, never>>> = await api.post(
      `/api/projects/${projectId}/label/auto`,
      {},
      {
        params: { memberId },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('오토 레이블링 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};
