import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useResetAlarmListQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarmList'] });
    },
  });
}
