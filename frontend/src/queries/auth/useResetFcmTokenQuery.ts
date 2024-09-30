import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useResetFcmTokenQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fcmToken'] });
    },
  });
}
