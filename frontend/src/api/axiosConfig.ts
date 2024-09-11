import axios from 'axios';
import useAuthStore from '@/stores/useAuthStore';

const baseURL = 'https://j11s002.p.ssafy.io';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest._retry) {
      console.error('토큰 재발급 중 401 오류가 발생했습니다. 로그아웃 처리합니다.');
      alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
      useAuthStore.getState().clearAuth();
      window.location.href = '/';
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post('/api/auth/reissue', null, {
          withCredentials: true,
        });

        if (!response.data?.data?.accessToken) {
          alert('잘못된 토큰 재발급 응답입니다. 다시 로그인해 주세요.');
          useAuthStore.getState().clearAuth();
          window.location.href = '/';
          return Promise.reject(new Error('Invalid token reissue response'));
        }

        const newAccessToken = response.data.data.accessToken;

        useAuthStore.getState().setLoggedIn(true, newAccessToken);
        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (reissueError) {
        console.error('토큰 재발급 실패:', reissueError);
        alert('토큰 재발급에 실패했습니다. 다시 로그인해 주세요.');
        useAuthStore.getState().clearAuth();
        window.location.href = '/';
        return Promise.reject(reissueError);
      }
    }

    if (error.response?.status === 400) {
      alert('잘못된 요청입니다. 다시 시도해 주세요.');
    } else if (error.response?.status === 403) {
      alert('권한이 없습니다. 다시 로그인해 주세요.');
      useAuthStore.getState().clearAuth();
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default api;
