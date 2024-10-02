import ReviewItem from './ReviewItem';
import ReviewSearchInput from './ReviewSearchInput';
import { ReviewResponse, ReviewStatus } from '@/types';

interface ReviewListProps {
  reviews: ReviewResponse[];
  activeTab: ReviewStatus | 'ALL';
  setActiveTab: React.Dispatch<React.SetStateAction<ReviewStatus | 'ALL'>>;
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
    <div className="relative w-full px-4">
      <div className="relative w-full">
        <div className="flex w-full items-center border-b-[1px] border-solid border-gray-300">
          {['REQUESTED', 'APPROVED', 'REJECTED', 'ALL'].map((tab) => (
            <button
              key={tab}
              className={`flex h-12 w-[100px] items-center justify-center px-3 ${
                activeTab === tab ? 'border-b-[3px] border-blue-500' : 'border-b-[3px] border-transparent'
              }`}
              onClick={() => setActiveTab(tab as typeof activeTab)}
            >
              <span className={`text-sm ${activeTab === tab ? 'font-semibold' : 'font-normal'} text-black`}>
                {tab === 'REQUESTED' ? '요청' : tab === 'APPROVED' ? '승인' : tab === 'REJECTED' ? '거부' : '전체'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full">
        <ReviewSearchInput
          onSearchChange={setSearchQuery}
          onSortChange={setSortValue}
          sortValue={sortValue}
        />
      </div>

      <div className="relative w-full overflow-y-auto">
        {reviews.length === 0 ? (
          <div className="py-4 text-center">리뷰가 없습니다.</div>
        ) : (
          reviews.map((item) => (
            <ReviewItem
              key={item.reviewId}
              workspaceId={workspaceId}
              reviewId={item.reviewId}
              title={item.title}
              createdTime={item.createdAt}
              updatedTime={item.updatedAt}
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
