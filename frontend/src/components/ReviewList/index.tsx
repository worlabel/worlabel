import { useState } from 'react';
import ReviewItem from './ReviewItem';
import ReviewSearchInput from './ReviewSearchInput';
import useReviewByStatusQuery from '@/queries/useReviewByStatusQuery';
import useAuthStore from '@/stores/useAuthStore';
import { useParams } from 'react-router-dom';

export default function ReviewList(): JSX.Element {
  const { projectId } = useParams<{ projectId: string }>();
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const [activeTab, setActiveTab] = useState<'REQUESTED' | 'APPROVED' | 'REJECTED' | 'all'>('REQUESTED');
  const [, setSearchQuery] = useState('');
  const [sortValue, setSortValue] = useState('latest');

  const { data: reviews = [] } = useReviewByStatusQuery(
    Number(projectId),
    memberId,
    activeTab !== 'all' ? activeTab : undefined
  );

  return (
    <div className="relative w-full">
      <div className="relative w-full px-4">
        <div className="flex w-full items-center border-b-[0.67px] border-solid border-[#dcdcde]">
          <button
            className={`flex h-12 w-[100px] items-center justify-between px-3 ${activeTab === 'REQUESTED' ? 'shadow-[inset_0px_-2px_0px_#1f75cb]' : ''}`}
            onClick={() => setActiveTab('REQUESTED')}
          >
            <span className={`text-sm ${activeTab === 'REQUESTED' ? 'font-semibold' : 'font-normal'} text-[#333238]`}>
              요청
            </span>
          </button>

          <button
            className={`flex h-12 w-[100px] items-center justify-between px-3 ${activeTab === 'APPROVED' ? 'shadow-[inset_0px_-2px_0px_#1f75cb]' : ''}`}
            onClick={() => setActiveTab('APPROVED')}
          >
            <span className={`text-sm ${activeTab === 'APPROVED' ? 'font-semibold' : 'font-normal'} text-[#333238]`}>
              승인
            </span>
          </button>

          <button
            className={`flex h-12 w-[100px] items-center justify-between px-3 ${activeTab === 'REJECTED' ? 'shadow-[inset_0px_-2px_0px_#1f75cb]' : ''}`}
            onClick={() => setActiveTab('REJECTED')}
          >
            <span className={`text-sm ${activeTab === 'REJECTED' ? 'font-semibold' : 'font-normal'} text-[#333238]`}>
              거부
            </span>
          </button>

          <button
            className={`flex h-12 w-[100px] items-center justify-between px-3 ${activeTab === 'all' ? 'shadow-[inset_0px_-2px_0px_#1f75cb]' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <span className={`text-sm ${activeTab === 'all' ? 'font-semibold' : 'font-normal'} text-[#333238]`}>
              전체
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
        {reviews.map((item) => (
          <ReviewItem
            key={item.reviewId}
            title={item.title}
            createdTime={item.createAt}
            creatorName={item.nickname}
            project={item.content}
            status={item.status}
            type={{ text: 'Classification', color: '#a2eeef' }}
          />
        ))}
      </div>
    </div>
  );
}
