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
  const alarmTypeToMessage = (alarmType: string) => {
    switch (alarmType) {
      case 'PREDICT':
        return '오토 레이블링이 완료되었습니다.';
      case 'TRAIN':
        return '학습이 완료되었습니다.';
      case 'IMAGE':
        return '이미지 업로드가 완료되었습니다.';
      case 'COMMENT':
        return '새로운 댓글이 추가되었습니다.';
      case 'REVIEW_RESULT':
        return '요청한 리뷰에 대한 결과가 등록되었습니다.';
      case 'REVIEW_REQUEST':
        return '새로운 리뷰 요청을 받았습니다.';
      default:
        return '새로운 알림입니다.';
    }
  };

  const handleRead = () => {
    onRead(alarm.id);
  };

  const handleDelete = () => {
    onDelete(alarm.id);
  };

  return (
    <div className="flex w-full items-center bg-white p-3 duration-150 hover:bg-gray-200">
      <div className="flex flex-1 flex-col">
        <div className="flex items-center">
          {!alarm.isRead && <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-orange-500"></div>}
          <p className={cn('body-small', alarm.isRead ? 'text-gray-400' : 'text-black')}>
            {alarmTypeToMessage(alarm.type)}
          </p>
        </div>
        <p className={cn('caption', alarm.isRead ? 'text-gray-400' : 'text-gray-500')}>{timeAgo(alarm.createdAt)}</p>
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
