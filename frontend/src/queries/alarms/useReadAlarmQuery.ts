import { readAlarm } from '@/api/alarmApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useReadAlarmQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alarmId: number) => readAlarm(alarmId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarmList'] });
    },
  });
}
