import { useState } from 'react';
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

  const { data: projectReviews = [] } = useReviewByStatusQuery(
    Number(projectId),
    memberId,
    activeTab !== 'all' ? activeTab : undefined
  );

  return (
    <div>
      <header className="bg-background sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b px-4">
        <h1 className="text-xl font-semibold">프로젝트 리뷰</h1>
        <Link
          to={`/admin/${workspaceId}/reviews/request`}
          className="ml-auto"
        >
          <Button variant="default">리뷰 요청</Button>
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
    </div>
  );
}
