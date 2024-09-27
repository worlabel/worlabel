import { getAndSaveFcmToken } from '@/api/authApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useFcmTokenQuery() {
  return useSuspenseQuery({
    queryKey: ['fcmToken'],
    queryFn: getAndSaveFcmToken,
  });
}
