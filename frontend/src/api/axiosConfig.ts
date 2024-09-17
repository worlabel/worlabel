import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '@/stores/useAuthStore';
import { BaseResponse, CustomError, SuccessResponse, RefreshTokenResponse } from '@/types';

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

let isTokenRefreshing = false;

type FailedRequest = {
  resolve: (value?: string | undefined) => void;
  reject: (reason?: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (error: Error | null, token: string | undefined = undefined): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<BaseResponse<CustomError>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isTokenRefreshing) {
        return new Promise<string | undefined>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isTokenRefreshing = true;

      try {
        const response: AxiosResponse<SuccessResponse<RefreshTokenResponse>> = await api.post('/auth/reissue', null, {
          withCredentials: true,
        });

        const newAccessToken = response.data.data?.accessToken;
        if (!newAccessToken) {
          throw new Error('Invalid token reissue response');
        }

        useAuthStore.getState().setLoggedIn(true, newAccessToken);
        processQueue(null, newAccessToken);

        const redirectUri = `/redirect/oauth2?accessToken=${newAccessToken}`;
        window.location.href = redirectUri;

        return Promise.reject(new Error('Redirecting to retrieve cookies'));
      } catch (reissueError: unknown) {
        processQueue(reissueError as Error, undefined);
        console.error('토큰 재발급 실패:', reissueError);
        useAuthStore.getState().clearAuth();
        window.location.href = '/';
        return Promise.reject(reissueError);
      } finally {
        isTokenRefreshing = false;
      }
    }

    handleCommonErrors(error);

    return Promise.reject(error);
  }
);

const handleCommonErrors = (error: AxiosError<BaseResponse<CustomError>>) => {
  if (error.response?.status === 400) {
    alert('잘못된 요청입니다. 다시 시도해 주세요.');
  } else if (error.response?.status === 403) {
    alert(error.response?.data?.message);
  } else {
    console.error('오류 발생:', error.response?.data?.message || '알 수 없는 오류');
  }
};

export default api;
