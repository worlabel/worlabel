import { useQuery, UseQueryResult, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import useAuthStore from '@/stores/useAuthStore';
import { reissueTokenApi, fetchProfileApi } from '@/api/authApi';
import { SuccessResponse, RefreshTokenResponseDTO, MemberResponseDTO, CustomError } from '@/types';
import { useState, useEffect } from 'react';

export const useReissueToken = (): UseMutationResult<
  SuccessResponse<RefreshTokenResponseDTO>,
  AxiosError<CustomError>
> => {
  const queryClient = useQueryClient();
  const { setLoggedIn } = useAuthStore();

  return useMutation({
    mutationFn: reissueTokenApi,
    onSuccess: (data) => {
      if (data.isSuccess && data.data) {
        setLoggedIn(true, data.data.accessToken);
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      } else {
        console.error('토큰 재발급 응답 오류:', data.message);
      }
    },
    onError: (error) => {
      console.error('토큰 재발급 실패:', error?.response?.data?.message || '알 수 없는 오류');
    },
  });
};

export const useProfile = (): UseQueryResult<SuccessResponse<MemberResponseDTO>, AxiosError<CustomError>> => {
  const { accessToken, setProfile } = useAuthStore();

  const query = useQuery<SuccessResponse<MemberResponseDTO>, AxiosError<CustomError>>({
    queryKey: ['profile'],
    queryFn: fetchProfileApi,
    enabled: !!accessToken,
    select: (data) => data,
  });

  useEffect(() => {
    if (query.data?.isSuccess) {
      setProfile(query.data.data);
    }
  }, [query.data, setProfile]);

  return query;
};

export const useFetchProfile = () => {
  const { profile, setProfile } = useAuthStore();
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (!profile && !isFetched) {
      fetchProfileApi()
        .then((data) => {
          if (data.isSuccess && data.data) {
            setProfile(data.data);
            setIsFetched(true);
          } else {
            console.error('프로필 응답 오류:', data.message);
          }
        })
        .catch((error: AxiosError<CustomError>) => {
          alert('프로필을 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.');
          console.error('프로필 가져오기 실패:', error?.response?.data?.message || '알 수 없는 오류');
        });
    }
  }, [profile, setProfile, isFetched]);
};
