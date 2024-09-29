import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useUpdateAlarmQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarmList'] });
    },
  });
}
