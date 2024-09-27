import { deleteAllAlarm } from '@/api/alarmApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useDeleteAllAlarmQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllAlarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarmList'] });
    },
  });
}
