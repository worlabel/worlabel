import { createAlarmTest } from '@/api/alarmApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useCreateAlarmTestQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAlarmTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alarmList'] });
    },
  });
}
