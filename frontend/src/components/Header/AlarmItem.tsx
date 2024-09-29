import { cn } from '@/lib/utils';
import timeAgo from '@/utils/timeAgo';
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
