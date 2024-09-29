import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { onMessage } from 'firebase/messaging';
import { messaging } from '@/api/firebaseConfig';
import useFcmTokenQuery from '@/queries/auth/useFcmTokenQuery';
import useGetAlarmListQuery from '@/queries/alarms/useGetAlarmListQuery';
import useResetAlarmListQuery from '@/queries/alarms/useResetAlarmListQuery';
import useCreateAlarmTestQuery from '@/queries/alarms/useCreateAlarmTestQuery';
import useReadAlarmQuery from '@/queries/alarms/useReadAlarmQuery';
import useDeleteAlarmQuery from '@/queries/alarms/useDeleteAlarmQuery';
import useDeleteAllAlarmQuery from '@/queries/alarms/useDeleteAllAlarmQuery';
import { Bell, Mail, MailOpen, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export default function AlarmPopover() {
  const [unread, setUnread] = useState<boolean>(false);

  const timeAgo = (date: string | Date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return `${Math.max(diffInSeconds, 0)}초 전`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 전`;
  };

  const resetAlarmList = useResetAlarmListQuery();
  const createAlarmTest = useCreateAlarmTestQuery();
  const readAlarm = useReadAlarmQuery();
  const deleteAlarm = useDeleteAlarmQuery();
  const deleteAllAlarm = useDeleteAllAlarmQuery();

  const handleResetAlarmList = () => {
    resetAlarmList.mutate();
  };

  const handleCreateAlarmTest = () => {
    createAlarmTest.mutate();
  };

  const handleReadAlarm = (alarmId: number) => {
    readAlarm.mutate(alarmId);
  };

  const handleDeleteAlarm = (alarmId: number) => {
    deleteAlarm.mutate(alarmId);
  };

  const handleDeleteAllAlarm = () => {
    deleteAllAlarm.mutate();
  };

  useFcmTokenQuery();
  const { data: alarms } = useGetAlarmListQuery();

  onMessage(messaging, (payload) => {
    if (!payload.data) return;

    console.log('new message arrived');
    handleResetAlarmList();
  });

  useEffect(() => {
    const unreadCnt = alarms.filter((alarm) => !alarm.isRead).length;

    if (unreadCnt > 0) {
      setUnread(true);
    } else {
      setUnread(false);
    }
  }, [alarms]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center justify-center p-2"
          onClick={() => {}}
        >
          <Bell className="h-4 w-4 cursor-pointer text-black sm:h-5 sm:w-5" />
          <div className={cn('mt-[14px] h-1.5 w-1.5 rounded-full', unread ? 'bg-blue-500' : 'bg-transparent')}></div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 overflow-hidden rounded-lg p-0"
        align="end"
        sideOffset={14}
        alignOffset={0}
      >
        <div className="flex w-full items-center px-[18px] py-3">
          <h2 className="body-strong flex-1">알림</h2>
          <button
            className="body-small p-1 text-blue-500"
            onClick={handleCreateAlarmTest}
          >
            테스트
          </button>
          {unread ? (
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
          )}
          <button
            className="body-small p-1 text-red-500"
            onClick={handleDeleteAllAlarm}
          >
            모두 삭제
          </button>
        </div>
        <hr />

        {alarms.length == 0 && (
          <div className="flex w-full items-center px-[18px] py-3 duration-150">
            <p className="body-small text-gray-500">알림이 없습니다.</p>
          </div>
        )}

        {alarms
          .slice()
          .reverse()
          .map((alarm) => (
            <div
              key={alarm.id}
              className="flex w-full items-center bg-white py-2 pr-[18px] duration-150 hover:bg-gray-200"
            >
              <div
                className={cn('mx-1.5 h-1.5 w-1.5 rounded-full', alarm.isRead ? 'bg-transparent' : 'bg-blue-500')}
              ></div>
              <div className="flex flex-1 flex-col">
                <p className="body-small">
                  [{alarm.id}] {alarm.type} 알림입니다.
                </p>
                <p className="caption text-gray-500">{timeAgo(alarm.createdAt)}</p>
              </div>
              {alarm.isRead ? (
                <button
                  className="p-1"
                  onClick={() => {}}
                >
                  <MailOpen
                    size={16}
                    className="stroke-gray-400"
                  />
                </button>
              ) : (
                <button
                  className="p-1"
                  onClick={() => {
                    handleReadAlarm(alarm.id);
                  }}
                >
                  <Mail size={16} />
                </button>
              )}
              <button
                className="p-1"
                onClick={() => {
                  handleDeleteAlarm(alarm.id);
                }}
              >
                <Trash2
                  size={16}
                  className="stroke-red-500"
                />
              </button>
            </div>
          ))}
      </PopoverContent>
    </Popover>
  );
}
