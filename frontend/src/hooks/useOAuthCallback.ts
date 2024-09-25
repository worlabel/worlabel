import useAuthStore from '@/stores/useAuthStore';
import useProfileQuery from '@/queries/auth/useProfileQuery';

export default function useHandleOAuthCallback() {
  const queryParams = new URLSearchParams(window.location.search);
  const accessToken = queryParams.get('accessToken');
  const setToken = useAuthStore((state) => state.setToken);
  const setProfile = useAuthStore((state) => state.setProfile);

  if (accessToken) {
    setToken(accessToken);
  }

  const { data: profile } = useProfileQuery();

  if (profile) {
    setProfile(profile);
  }
}
