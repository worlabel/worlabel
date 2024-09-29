import { getAlarmList } from '@/api/alarmApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useGetAlarmListQuery() {
  return useSuspenseQuery({
    queryKey: ['alarmList'],
    queryFn: getAlarmList,
  });
}
