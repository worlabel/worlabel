import useAuthStore from '@/stores/useAuthStore';
import useProfileQuery from '@/queries/auth/useProfileQuery';
import useGetFcmTokenQuery from '@/queries/auth/useGetFcmTokenQuery';
import useSaveFcmTokenQuery from '@/queries/auth/useSaveFcmTokenQuery';

export default function useHandleOAuthCallback() {
  const queryParams = new URLSearchParams(window.location.search);
  const accessToken = queryParams.get('accessToken');
  const setToken = useAuthStore((state) => state.setToken);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setFcmToken = useAuthStore((state) => state.setFcmToken);

  if (accessToken) {
    setToken(accessToken);
  }

  const { data: profile } = useProfileQuery();

  if (profile) {
    setProfile(profile);
  }

  const { data: fcmToken } = useGetFcmTokenQuery(); // FCM 토큰을 가져온다.
  setFcmToken(fcmToken ?? ''); // FCM 토큰을 authStore에 저장한다.
  useSaveFcmTokenQuery().mutate(fcmToken ?? ''); // FCM 토큰을 서버에 전송한다.
}
