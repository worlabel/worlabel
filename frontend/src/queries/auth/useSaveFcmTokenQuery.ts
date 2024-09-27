import { saveFcmToken } from '@/api/authApi';
import { useMutation } from '@tanstack/react-query';

export default function useSaveFcmTokenQuery() {
  return useMutation({
    mutationFn: (fcmToken: string) => saveFcmToken(fcmToken),
  });
}
