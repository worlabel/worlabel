import { Suspense, useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import useReviewByStatusQuery from '@/queries/reviews/useReviewByStatusQuery';
import useAuthStore from '@/stores/useAuthStore';
import ReviewList from '@/components/ReviewList';
import { Button } from '@/components/ui/button';

export default function ProjectReviewList() {
  const { workspaceId, projectId } = useParams<{ workspaceId: string; projectId: string }>();
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const [activeTab, setActiveTab] = useState<'REQUESTED' | 'APPROVED' | 'REJECTED' | 'all'>('REQUESTED');
  const [, setSearchQuery] = useState('');
  const [sortValue, setSortValue] = useState('latest');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useReviewByStatusQuery(
    Number(projectId),
    memberId,
    activeTab !== 'all' ? activeTab : undefined
  );

  const projectReviews = data?.pages.flat() || [];

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-white px-4">
          <h1 className="text-xl font-semibold">프로젝트 리뷰</h1>
          <Link
            to={`/admin/${workspaceId}/reviews/request`}
            className="ml-auto"
          >
            <Button variant="outlinePrimary">리뷰 요청</Button>
          </Link>
        </header>

        <ReviewList
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
