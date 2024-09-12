import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';
import { fetchProfileApi } from '@/api/authApi';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get('accessToken');

    if (accessToken) {
      setLoggedIn(true, accessToken);
      sessionStorage.setItem('accessToken', accessToken);

      fetchProfileApi()
        .then((data) => {
          if (data?.isSuccess && data.data) {
            const profileData = {
              id: data.data.id,
              nickname: data.data.nickname,
              profileImage: data.data.profileImage,
            };
            useAuthStore.getState().setProfile(profileData);
            navigate('/browse');
          } else {
            throw new Error('프로필 데이터를 가져올 수 없습니다.');
          }
        })
        .catch((error) => {
          alert('프로필을 가져오는 중 오류가 발생했습니다. 다시 로그인해주세요.');
          console.error('프로필 가져오기 실패:', error);
          navigate('/');
        });
    } else {
      navigate('/');
    }
  }, [navigate, setLoggedIn]);

  return <p>처리 중입니다...</p>;
}
