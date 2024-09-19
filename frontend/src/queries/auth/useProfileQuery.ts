import { getProfile } from '@/api/authApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useProfileQuery() {
  return useSuspenseQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });
}
