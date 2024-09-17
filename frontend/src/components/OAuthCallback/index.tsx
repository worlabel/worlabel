import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';
import useProfileQuery from '@/queries/useProfileQuery';

export default function OAuthCallback() {
  const queryParams = new URLSearchParams(window.location.search);
  const accessToken = queryParams.get('accessToken');
  const navigate = useNavigate();
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const setProfile = useAuthStore((state) => state.setProfile);
  const { data: profile } = useProfileQuery();

  useEffect(() => {
    if (!accessToken) {
      navigate('/');
      return;
    }

    setLoggedIn(true, accessToken);
    setProfile(profile);
    navigate('/browse');
  }, [accessToken, navigate, profile, setLoggedIn, setProfile]);

  return <p>처리 중입니다...</p>;
}
