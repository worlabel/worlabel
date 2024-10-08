import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { onMessage } from 'firebase/messaging';
import { messaging } from '@/api/firebaseConfig';
import AlarmItem from './AlarmItem';
import useGetAndSaveFcmTokenQuery from '@/queries/auth/useGetAndSaveFcmTokenQuery';
import useResetFcmTokenQuery from '@/queries/auth/useResetFcmTokenQuery';
import useGetAlarmListQuery from '@/queries/alarms/useGetAlarmListQuery';
import useResetAlarmListQuery from '@/queries/alarms/useResetAlarmListQuery';
// import useCreateAlarmTestQuery from '@/queries/alarms/useCreateAlarmTestQuery';
import useReadAlarmQuery from '@/queries/alarms/useReadAlarmQuery';
import useDeleteAlarmQuery from '@/queries/alarms/useDeleteAlarmQuery';
import useDeleteAllAlarmQuery from '@/queries/alarms/useDeleteAllAlarmQuery';

export default function AlarmPopover() {
  const [unread, setUnread] = useState<boolean>(false);

  const resetFcmToken = useResetFcmTokenQuery();
  const resetAlarmList = useResetAlarmListQuery();
  // const createAlarmTest = useCreateAlarmTestQuery();
  const readAlarm = useReadAlarmQuery();
  const deleteAlarm = useDeleteAlarmQuery();
  const deleteAllAlarm = useDeleteAllAlarmQuery();

  // const handleCreateAlarmTest = () => {
  //   createAlarmTest.mutate();
  // };

  const handleReadAlarm = (alarmId: number) => {
    readAlarm.mutate(alarmId);
  };

  const handleDeleteAlarm = (alarmId: number) => {
    deleteAlarm.mutate(alarmId);
  };

  const handleDeleteAllAlarm = () => {
    deleteAllAlarm.mutate();
  };

  useGetAndSaveFcmTokenQuery();
  const { data: alarmList } = useGetAlarmListQuery();

  onMessage(messaging, (payload) => {
    if (!payload.data) return;

    console.log('new message arrived');
    resetAlarmList.mutate();
  });

  useEffect(() => {
    const unreadCnt = alarmList.filter((alarm) => !alarm.isRead).length;

    if (unreadCnt > 0) {
      setUnread(true);
    } else {
      setUnread(false);
    }
  }, [alarmList]);

  useEffect(() => {
    // 현재 창에 포커스 시 실행할 메서드
    const handleFocus = () => {
      resetFcmToken.mutate();
      resetAlarmList.mutate();
    };

    // 현재 창에 포커스 해제 시 실행할 메서드
    // const handleBlur = () => {};

    // window에 focus와 blur 이벤트 리스너 등록
    window.addEventListener('focus', handleFocus);
    // window.addEventListener('blur', handleBlur);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('focus', handleFocus);
      // window.removeEventListener('blur', handleBlur);
    };
  }, [resetAlarmList, resetFcmToken]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center justify-center p-2 pr-0.5">
          <Bell className="h-4 w-4 cursor-pointer text-black sm:h-5 sm:w-5" />
          <div className={cn('mt-[14px] h-1.5 w-1.5 rounded-full', unread ? 'bg-orange-500' : 'bg-transparent')}></div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[360px] overflow-hidden rounded-lg p-0"
        align="end"
        sideOffset={14}
        alignOffset={0}
      >
        <div className="flex w-full items-center p-3">
          <h2 className="body-strong flex-1">알림</h2>
          {/* <button
            className="body-small p-1 text-gray-400"
            onClick={handleCreateAlarmTest}
          >
            테스트
          </button> */}
          {/* {unread ? (
            <button
              className="body-small p-1"
              onClick={() => {}}
            >
              모두 읽음
            </button>
          ) : (
            <button
              className="body-small p-1"
              onClick={() => {}}
            >
              모두 읽지 않음
            </button>
          )} */}
          <button
            className="body-small-strong p-1 text-red-500"
            onClick={handleDeleteAllAlarm}
          >
            모두 삭제
          </button>
        </div>
        <hr />

        {alarmList.length === 0 ? (
          <div className="flex w-full items-center p-3 duration-150">
            <p className="body-small text-gray-500">알림이 없습니다.</p>
          </div>
        ) : (
          <div className="flex max-h-[500px] w-full flex-col items-center overflow-y-auto">
            {alarmList
              .slice()
              .reverse()
              .map((alarm) => (
                <AlarmItem
                  key={alarm.id}
                  alarm={alarm}
                  onRead={handleReadAlarm}
                  onDelete={handleDeleteAlarm}
                />
              ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
