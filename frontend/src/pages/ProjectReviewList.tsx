import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useReviewByStatusQuery from '@/queries/reviews/useReviewByStatusQuery';
import useAuthStore from '@/stores/useAuthStore';
import ReviewList from '@/components/ReviewList';

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
    <ReviewList
      reviews={projectReviews}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      setSearchQuery={setSearchQuery}
      sortValue={sortValue}
      setSortValue={setSortValue}
      workspaceId={Number(workspaceId)}
    />
  );
}
