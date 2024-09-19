import { useState } from 'react';
import ReviewItem from './ReviewItem';
import ReviewSearchInput from './ReviewSearchInput';
import useReviewByStatusQuery from '@/queries/reviews/useReviewByStatusQuery';
import useAuthStore from '@/stores/useAuthStore';

interface ProjectReviewListProps {
  projectId: number;
  workspaceId: number;
}

export default function ProjectReviewList({ projectId, workspaceId }: ProjectReviewListProps): JSX.Element {
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const [activeTab, setActiveTab] = useState<'REQUESTED' | 'APPROVED' | 'REJECTED' | 'all'>('REQUESTED');
  const [, setSearchQuery] = useState('');
  const [sortValue, setSortValue] = useState('latest');

  const { data: projectReviews = [] } = useReviewByStatusQuery(
    projectId,
    memberId,
    activeTab !== 'all' ? activeTab : undefined
  );

  return (
    <div className="relative w-full">
      <div className="relative w-full px-4">
        <div className="flex w-full items-center border-b-[0.67px] border-solid border-[#dcdcde]">
          {['REQUESTED', 'APPROVED', 'REJECTED', 'all'].map((tab) => (
            <button
              key={tab}
              className={`flex h-12 w-[100px] items-center justify-between px-3 ${
                activeTab === tab ? 'shadow-[inset_0px_-2px_0px_#1f75cb]' : ''
              }`}
              onClick={() => setActiveTab(tab as typeof activeTab)}
            >
              <span className={`text-sm ${activeTab === tab ? 'font-semibold' : 'font-normal'} text-[#333238]`}>
                {tab === 'REQUESTED' ? '요청' : tab === 'APPROVED' ? '승인' : tab === 'REJECTED' ? '거부' : '전체'}
              </span>
            </button>
          ))}
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
        {projectReviews.length === 0 ? (
          <div className="py-4 text-center">프로젝트에 리뷰가 없습니다.</div>
        ) : (
          projectReviews.map((item) => (
            <ReviewItem
              key={item.reviewId}
              workspaceId={workspaceId}
              reviewId={item.reviewId}
              title={item.title}
              createdTime={item.createAt}
              creatorName={item.nickname}
              projectId={item.projectId}
              status={item.status}
            />
          ))
        )}
      </div>
    </div>
  );
}
