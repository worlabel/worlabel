import { createTestAlarm } from '@/api/alarmApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useCreateTestAlarmQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTestAlarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarmList'] });
    },
  });
}
