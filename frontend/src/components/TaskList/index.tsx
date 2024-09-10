import { useState } from 'react';
import TaskItem from './TaskItem';
import TaskSearchInput from './TaskSearchInput';

interface TaskListProps {
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
    commentsCount: number;
    updatesCount: number;
    lastUpdated: string;
    memberCount: number;
  }[];
}

const typeColors: Record<'Classification' | 'Detection' | 'Polygon' | 'Polyline', string> = {
  Classification: '#a2eeef',
  Detection: '#d4c5f9',
  Polygon: '#f9c5d4',
  Polyline: '#c5f9d4',
};

export default function TaskList({ acceptedCount, pendingCount, totalCount, items }: TaskListProps): JSX.Element {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortValue, setSortValue] = useState('latest');

  const filteredItems = items
    .filter((item) => {
      if (activeTab === 'in_progress') return item.status.toLowerCase() === 'in_progress';
      if (activeTab === 'completed') return item.status.toLowerCase() === 'completed';
      if (activeTab === 'all') return true;
      return false;
    })
    .filter((item) => item.title.includes(searchQuery))
    .sort((a, b) => {
      switch (sortValue) {
        case 'oldest':
          return new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime();
        case 'comments':
          return b.commentsCount - a.commentsCount;
        case 'updates':
          return b.updatesCount - a.updatesCount;
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
              activeTab === 'all' ? 'shadow-[inset_0px_-2px_0px_#1f75cb]' : ''
            }`}
            onClick={() => setActiveTab('all')}
          >
            <span
              className={`text-sm ${
                activeTab === 'all' ? 'font-semibold text-[#333238]' : 'font-normal text-[#737278]'
              }`}
            >
              전체
            </span>
            <span className="flex h-4 w-6 items-center justify-center rounded-[160px] bg-[#ececef] text-xs text-[#626168]">
              {totalCount}
            </span>
          </button>

          <button
            className={`flex h-12 w-[100px] items-center justify-between px-3 ${
              activeTab === 'in_progress' ? 'shadow-[inset_0px_-2px_0px_#1f75cb]' : ''
            }`}
            onClick={() => setActiveTab('in_progress')}
          >
            <span
              className={`text-sm ${
                activeTab === 'in_progress' ? 'font-semibold text-[#333238]' : 'font-normal text-[#737278]'
              }`}
            >
              진행중
            </span>
            <span className="flex h-4 w-6 items-center justify-center rounded-[160px] bg-[#ececef] text-xs text-[#626168]">
              {pendingCount}
            </span>
          </button>

          <button
            className={`flex h-12 w-[100px] items-center justify-between px-3 ${
              activeTab === 'completed' ? 'shadow-[inset_0px_-2px_0px_#1f75cb]' : ''
            }`}
            onClick={() => setActiveTab('completed')}
          >
            <span
              className={`text-sm ${
                activeTab === 'completed' ? 'font-semibold text-[#333238]' : 'font-normal text-[#737278]'
              }`}
            >
              완료
            </span>
            <span className="flex h-4 w-6 items-center justify-center rounded-[160px] bg-[#ececef] text-xs text-[#626168]">
              {acceptedCount}
            </span>
          </button>
        </div>
      </div>

      <div className="relative w-full px-4">
        <TaskSearchInput
          onSearchChange={setSearchQuery}
          onSortChange={setSortValue}
          sortValue={sortValue}
        />
      </div>

      <div className="relative w-full overflow-y-auto px-4">
        {filteredItems.map((item, index) => (
          <TaskItem
            key={index}
            title={item.title}
            createdTime={item.createdTime}
            creatorName={item.creatorName}
            project={item.project}
            status={item.status}
            commentsCount={item.commentsCount}
            updatesCount={item.updatesCount}
            lastUpdated={item.lastUpdated}
            type={item.type}
            bgColor={typeColors[item.type]}
            memberCount={item.memberCount}
          />
        ))}
      </div>
    </div>
  );
}
