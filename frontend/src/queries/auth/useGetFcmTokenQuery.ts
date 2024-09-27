import { getFcmToken } from '@/api/firebaseConfig';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useGetFcmTokenQuery() {
  return useSuspenseQuery({
    queryKey: ['fcmToken'],
    queryFn: getFcmToken,
  });
}
