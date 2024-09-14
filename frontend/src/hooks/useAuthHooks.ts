import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import useAuthStore from '@/stores/useAuthStore';
import { reissueToken, getProfile } from '@/api/authApi';
import { CustomError } from '@/types';
import { useState, useEffect } from 'react';
import useProfileQuery from '@/queries/useProfileQuery';

export const useReissueToken = () => {
  const queryClient = useQueryClient();
  const { setLoggedIn } = useAuthStore();

  return useMutation({
    mutationFn: reissueToken,
    onSuccess: (data) => {
      setLoggedIn(true, data.accessToken);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useProfile = () => {
  const { setProfile } = useAuthStore();
  const query = useProfileQuery();

  // TODO: query.data가 변경될 때마다 setProfile을 호출하여 profile 업데이트, useEffect 제거
  useEffect(() => {
    setProfile(query.data);
  }, [query.data, setProfile]);

  return query;
};

export const useFetchProfile = () => {
  const { profile, setProfile } = useAuthStore();
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (!profile && !isFetched) {
      getProfile()
        .then((data) => {
          setProfile(data);
          setIsFetched(true);
        })
        .catch((error: AxiosError<CustomError>) => {
          alert('프로필을 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.');
          console.error('프로필 가져오기 실패:', error?.response?.data?.message || '알 수 없는 오류');
        });
    }
  }, [profile, setProfile, isFetched]);
};
