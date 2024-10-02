import ReviewItem from './ReviewItem';
import ReviewSearchInput from './ReviewSearchInput';
import { ReviewResponse, ReviewStatus } from '@/types';

interface ReviewListProps {
  reviews: ReviewResponse[];
  activeTab: ReviewStatus | 'all';
  setActiveTab: React.Dispatch<React.SetStateAction<ReviewStatus | 'all'>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  sortValue: string;
  setSortValue: React.Dispatch<React.SetStateAction<string>>;
  workspaceId: number;
}

export default function ReviewList({
  reviews,
  activeTab,
  setActiveTab,
  setSearchQuery,
  sortValue,
  setSortValue,
  workspaceId,
}: ReviewListProps) {
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
        {reviews.length === 0 ? (
          <div className="py-4 text-center">리뷰가 없습니다.</div>
        ) : (
          reviews.map((item) => (
            <ReviewItem
              key={item.reviewId}
              workspaceId={workspaceId}
              reviewId={item.reviewId}
              title={item.title}
              createdTime={item.createAt}
              creatorName={item.author.nickname}
              projectId={item.projectId}
              status={item.status}
            />
          ))
        )}
      </div>
    </div>
  );
}
