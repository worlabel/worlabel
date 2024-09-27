import { deleteAlarm } from '@/api/alarmApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useDeleteAlarmQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alarmId: number) => deleteAlarm(alarmId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarmList'] });
    },
  });
}
