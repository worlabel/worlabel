import { useState } from 'react';
import ReviewItem from './ReviewItem';
import ReviewSearchInput from './ReviewSearchInput';

interface ReviewListProps {
  acceptedCount: number;
  rejectedCount: number;
  pendingCount: number;
  totalCount: number;
  items: {
    title: string;
    createdTime: string;
    creatorName: string;
    project: string;
    type: 'Classification' | 'Detection' | 'Polygon' | 'Polyline';
    status: string;
  }[];
}

const typeColors: Record<'Classification' | 'Detection' | 'Polygon' | 'Polyline', string> = {
  Classification: '#a2eeef',
  Detection: '#d4c5f9',
  Polygon: '#f9c5d4',
  Polyline: '#c5f9d4',
};

export default function ReviewList({
  acceptedCount,
  rejectedCount,
  pendingCount,
  totalCount,
  items,
}: ReviewListProps): JSX.Element {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortValue, setSortValue] = useState('latest');

  const filteredItems = items
    .filter((item) => {
      if (activeTab === 'pending') return item.status.toLowerCase() === 'needs_review';
      if (activeTab === 'accepted') return item.status.toLowerCase() === 'completed';
      if (activeTab === 'rejected')
        return item.status.toLowerCase() === 'in_progress' || item.status.toLowerCase() === 'pending';
      if (activeTab === 'all') return true;
      return false;
    })
    .filter((item) => item.title.includes(searchQuery))
    .sort((a, b) => {
      switch (sortValue) {
        case 'oldest':
          return new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime();
        default:
          return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();
      }
    });

  return (
    <div className="relative w-full">
      <div className="relative w-full px-4">
        <div className="flex w-full items-center border-b-[0.67px] border-solid border-[#dcdcde]">
          <button
            className={`flex h-12 w-[100px] items-center justify-between px-3 ${
              activeTab === 'pending' ? 'shadow-[inset_0px_-2px_0px_#1f75cb]' : ''
            }`}
            onClick={() => setActiveTab('pending')}
          >
            <span className={`text-sm ${activeTab === 'pending' ? 'font-semibold' : 'font-normal'} text-[#333238]`}>
              요청
            </span>
            <span className="flex h-4 w-6 items-center justify-center rounded-[160px] bg-[#ececef] text-xs text-[#626168]">
              {pendingCount}
            </span>
          </button>

          <button
            className={`flex h-12 w-[100px] items-center justify-between px-3 ${
              activeTab === 'accepted' ? 'shadow-[inset_0px_-2px_0px_#1f75cb]' : ''
            }`}
            onClick={() => setActiveTab('accepted')}
          >
            <span className={`text-sm ${activeTab === 'accepted' ? 'font-semibold' : 'font-normal'} text-[#333238]`}>
              승인
            </span>
            <span className="flex h-4 w-6 items-center justify-center rounded-[160px] bg-[#ececef] text-xs text-[#626168]">
              {acceptedCount}
            </span>
          </button>

          <button
            className={`flex h-12 w-[100px] items-center justify-between px-3 ${
              activeTab === 'rejected' ? 'shadow-[inset_0px_-2px_0px_#1f75cb]' : ''
            }`}
            onClick={() => setActiveTab('rejected')}
          >
            <span className={`text-sm ${activeTab === 'rejected' ? 'font-semibold' : 'font-normal'} text-[#333238]`}>
              거부
            </span>
            <span className="flex h-4 w-6 items-center justify-center rounded-[160px] bg-[#ececef] text-xs text-[#626168]">
              {rejectedCount}
            </span>
          </button>

          <button
            className={`flex h-12 w-[100px] items-center justify-between px-3 ${
              activeTab === 'all' ? 'shadow-[inset_0px_-2px_0px_#1f75cb]' : ''
            }`}
            onClick={() => setActiveTab('all')}
          >
            <span className={`text-sm ${activeTab === 'all' ? 'font-semibold' : 'font-normal'} text-[#333238]`}>
              전체
            </span>
            <span className="flex h-4 w-6 items-center justify-center rounded-[160px] bg-[#ececef] text-xs text-[#626168]">
              {totalCount}
            </span>
          </button>
        </div>
      </div>

      <div className="relative w-full px-4">
        <ReviewSearchInput
          onSearchChange={setSearchQuery}
          onSortChange={setSortValue}
          sortValue={sortValue}
        />
      </div>

      <div className="relative w-full overflow-y-auto px-4">
        {filteredItems.map((item, index) => (
          <ReviewItem
            key={index}
            title={item.title}
            createdTime={item.createdTime}
            creatorName={item.creatorName}
            project={item.project}
            status={item.status}
            type={{ text: item.type, color: typeColors[item.type] }}
          />
        ))}
      </div>
    </div>
  );
}
