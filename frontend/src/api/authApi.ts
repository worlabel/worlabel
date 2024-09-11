import api from '@/api/axiosConfig';
import { AxiosError } from 'axios';

export const reissueTokenApi = async () => {
  try {
    const response = await api.post('/api/auth/reissue', null, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('토큰 재발급 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const fetchProfileApi = async () => {
  try {
    const response = await api.get('/api/auth/profile', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('사용자 정보 가져오기 실패:', error.response?.data?.message || '알 수 없는 오류');
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
    }
    throw error;
  }
};
