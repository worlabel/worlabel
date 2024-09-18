import useAuthStore from '@/stores/useAuthStore';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getProfile } from '@/api/authApi';

export function useHandleOAuthCallback() {
  const queryParams = new URLSearchParams(window.location.search);
  const accessToken = queryParams.get('accessToken');
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const setProfile = useAuthStore((state) => state.setProfile);

  accessToken && setLoggedIn(true, accessToken);

  const { data: profile } = useSuspenseQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  setProfile(profile);
}
