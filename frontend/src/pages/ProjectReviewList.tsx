import { Suspense, useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import useReviewByStatusQuery from '@/queries/reviews/useReviewByStatusQuery';
import useAuthStore from '@/stores/useAuthStore';
import ReviewList from '@/components/ReviewList';
import { Button } from '@/components/ui/button';
import { ReviewStatus } from '@/types';

export default function ProjectReviewList() {
  const { workspaceId, projectId } = useParams<{ workspaceId: string; projectId: string }>();
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const [activeTab, setActiveTab] = useState<ReviewStatus | 'ALL'>('REQUESTED');
  const [, setSearchQuery] = useState('');
  const [sortValue, setSortValue] = useState('latest');

  const sortDirection = sortValue === 'latest' ? 0 : 1;
  const reviewStatus = activeTab !== 'ALL' ? activeTab : undefined;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useReviewByStatusQuery(
    Number(projectId),
    memberId,
    reviewStatus,
    sortDirection
  );

  const projectReviews = data?.pages.flat() || [];

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    refetch();
  }, [sortDirection, reviewStatus, refetch]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Suspense fallback={<div></div>}>
      <div>
        <header className="flex items-center border-b border-gray-200 bg-white p-4">
          <h1 className="heading">프로젝트 리뷰</h1>
          <Link
            to={`/review/${workspaceId}/request`}
            className="ml-auto"
          >
            <Button variant="blue">리뷰 요청</Button>
          </Link>
        </header>

        <ReviewList
          key={`${sortValue}-${activeTab}`}
          reviews={projectReviews}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSearchQuery={setSearchQuery}
          sortValue={sortValue}
          setSortValue={setSortValue}
          workspaceId={Number(workspaceId)}
        />
        {isFetchingNextPage}
        <div
          ref={loadMoreRef}
          className="h-1"
        />
      </div>
    </Suspense>
  );
}
