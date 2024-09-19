import useAuthStore from '@/stores/useAuthStore';
import useProfileQuery from '@/queries/auth/useProfileQuery';

export default function useHandleOAuthCallback() {
  const queryParams = new URLSearchParams(window.location.search);
  const accessToken = queryParams.get('accessToken');
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const setProfile = useAuthStore((state) => state.setProfile);

  if (accessToken) {
    setLoggedIn(true, accessToken);
  }

  const { data: profile } = useProfileQuery();

  if (profile) {
    setProfile(profile);
  }
}
