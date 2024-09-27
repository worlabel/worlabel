import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { onMessage } from 'firebase/messaging';
import { messaging } from '@/api/firebaseConfig';
import useGetAlarmListQuery from '@/queries/alarms/useGetAlarmListQuery';
import useFcmTokenQuery from '@/queries/auth/useFcmTokenQuery';
import useCreateTestAlarmQuery from '@/queries/alarms/useCreateTestAlarmQuery';
// import useDeleteAlarmQuery from '@/queries/alarms/useDeleteAlarmQuery';
import useDeleteAllAlarmQuery from '@/queries/alarms/useDeleteAllAlarmQuery';

export default function AlarmPopover() {
  useFcmTokenQuery();

  const { data: alarms } = useGetAlarmListQuery();

  onMessage(messaging, (payload) => {
    if (!payload.data) return;

    console.log(payload.data);
  });

  const createTestAlarm = useCreateTestAlarmQuery();
  // const deleteAlarm = useDeleteAlarmQuery();
  const deleteAllAlarm = useDeleteAllAlarmQuery();

  const handleCreateTestAlarm = () => {
    createTestAlarm.mutate();
  };

  // const handleDeleteAlarm = (alarmId: number) => {
  //   deleteAlarm.mutate(alarmId);
  // };

  const handleDeleteAllAlarm = () => {
    deleteAllAlarm.mutate();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-center p-2">
          <Bell className="h-4 w-4 cursor-pointer text-black sm:h-5 sm:w-5" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        {alarms.map((alarm, index) => (
          <div key={index}>
            {alarm.id} {alarm.type}
          </div>
        ))}
        <Button
          onClick={handleCreateTestAlarm}
          variant="outlinePrimary"
          className="mr-2"
        >
          알림 전송
        </Button>
        <Button
          onClick={handleDeleteAllAlarm}
          variant="outlinePrimary"
          className="mr-2"
        >
          알림 모두 삭제
        </Button>
      </PopoverContent>
    </Popover>
  );
}
