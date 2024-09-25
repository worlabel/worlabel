import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '@/stores/useAuthStore';
import { reissueToken } from '@/api/authApi';

export default function useReissueTokenQuery() {
  const queryClient = useQueryClient();
  const { setToken } = useAuthStore();

  return useMutation({
    mutationFn: reissueToken,
    onSuccess: (data) => {
      setToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
