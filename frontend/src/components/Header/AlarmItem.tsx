import { cn } from '@/lib/utils';
import { AlarmResponse } from '@/types';
import { Mail, MailOpen, Trash2 } from 'lucide-react';

export default function AlarmItem({
  alarm,
  onRead,
  onDelete,
}: {
  alarm: AlarmResponse;
  onRead: (alarmId: number) => void;
  onDelete: (alarmId: number) => void;
}) {
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

  const handleRead = () => {
    onRead(alarm.id);
  };

  const handleDelete = () => {
    onDelete(alarm.id);
  };

  return (
    <div className="flex w-full items-center bg-white py-2 pr-[18px] duration-150 hover:bg-gray-200">
      <div className={cn('mx-1.5 h-1.5 w-1.5 rounded-full', alarm.isRead ? 'bg-transparent' : 'bg-blue-500')}></div>
      <div className="flex flex-1 flex-col">
        <p className={cn('body-small', alarm.isRead ? 'text-gray-400' : 'text-black')}>
          [{alarm.id}] {alarm.type} 알림입니다.
        </p>
        <p className="caption text-gray-500">{timeAgo(alarm.createdAt)}</p>
      </div>
      {alarm.isRead ? (
        <button
          className="p-1"
          disabled
        >
          <MailOpen
            size={16}
            className="stroke-gray-400"
          />
        </button>
      ) : (
        <button
          className="p-1"
          onClick={handleRead}
        >
          <Mail size={16} />
        </button>
      )}
      <button
        className="p-1"
        onClick={handleDelete}
      >
        <Trash2
          size={16}
          className="stroke-red-500"
        />
      </button>
    </div>
  );
}
