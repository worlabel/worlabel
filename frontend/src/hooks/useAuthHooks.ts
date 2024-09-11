import { useQuery, UseQueryResult, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import useAuthStore from '@/stores/useAuthStore';
import { reissueTokenApi, fetchProfileApi } from '@/api/authApi';
import { useState, useEffect } from 'react';

interface TokenResponse {
  status: number;
  code: number;
  message: string;
  data: {
    accessToken: string;
  };
  errors: Array<{
    field: string;
    code: string;
    message: string;
    objectName: string;
  }>;
  isSuccess: boolean;
}

interface ProfileResponse {
  status: number;
  code: number;
  message: string;
  data: {
    id: number;
    nickname: string;
    profileImage: string;
  };
  errors: Array<{
    field: string;
    code: string;
    message: string;
    objectName: string;
  }>;
  isSuccess: boolean;
}

interface ErrorResponse {
  message: string;
}

export const useReissueToken = (): UseMutationResult<TokenResponse, AxiosError<ErrorResponse>> => {
  const queryClient = useQueryClient();
  const { setLoggedIn } = useAuthStore();

  return useMutation({
    mutationFn: reissueTokenApi,
    onSuccess: (data) => {
      setLoggedIn(true, data.data.accessToken);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      console.error('토큰 재발급 실패:', error?.response?.data?.message || '알 수 없는 오류');
    },
  });
};

export const useProfile = (): UseQueryResult<ProfileResponse, AxiosError<ErrorResponse>> => {
  const { accessToken, setProfile } = useAuthStore();

  return useQuery<ProfileResponse, AxiosError<ErrorResponse>>({
    queryKey: ['profile'],
    queryFn: fetchProfileApi,
    enabled: !!accessToken,
    select: (data) => {
      if (data.isSuccess) {
        setProfile({
          id: data.data.id,
          nickname: data.data.nickname,
          profileImage: data.data.profileImage,
        });
      }
      return data;
    },
  });
};

export const useFetchProfile = () => {
  const { profile, setProfile } = useAuthStore();
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (!profile.id && !isFetched) {
      fetchProfileApi()
        .then((data) => {
          if (data?.isSuccess && data.data) {
            setProfile({
              id: data.data.id,
              nickname: data.data.nickname,
              profileImage: data.data.profileImage,
            });
            setIsFetched(true);
          }
        })
        .catch((error) => {
          alert('프로필을 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.');
          console.error('프로필 가져오기 실패:', error);
        });
    }
  }, [profile.id, setProfile, isFetched]);
};
