import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '@/stores/useAuthStore';
import { RefreshTokenResponse } from '@/types';

const REFRESH_URL = '/auth/reissue';
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status !== 401 || error.request.responseURL?.includes(REFRESH_URL)) {
      return Promise.reject(error);
    }

    return api
      .post<RefreshTokenResponse>(REFRESH_URL)
      .then(({ data }) => {
        console.log(data);
        const { accessToken } = data;
        useAuthStore.getState().setLoggedIn(true, accessToken);
        if (error.config) {
          return api(error.config);
        }
        return Promise.reject(error);
      })
      .catch((error) => {
        useAuthStore.getState().clearAuth();
        window.location.href = '/';
        return Promise.reject(error);
      });
  }
);

export default api;
