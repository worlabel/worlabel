import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '@/stores/useAuthStore';
import { logout } from '@/api/authApi';

export default function useLogoutQuery() {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['fcmToken'] });
    },
  });
}
