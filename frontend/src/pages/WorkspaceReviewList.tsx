import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useWorkspaceReviewsQuery from '@/queries/workspaces/useWorkspaceReviewsQuery';
import useAuthStore from '@/stores/useAuthStore';
import ReviewList from '@/components/ReviewList';

export default function WorkspaceReviewList() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const [activeTab, setActiveTab] = useState<'REQUESTED' | 'APPROVED' | 'REJECTED' | 'all'>('REQUESTED');
  const [, setSearchQuery] = useState('');
  const [sortValue, setSortValue] = useState('latest');

  const { data: workspaceReviews = [] } = useWorkspaceReviewsQuery(
    Number(workspaceId),
    memberId,
    activeTab !== 'all' ? activeTab : undefined
  );

  return (
    <ReviewList
      reviews={workspaceReviews}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      setSearchQuery={setSearchQuery}
      sortValue={sortValue}
      setSortValue={setSortValue}
      workspaceId={Number(workspaceId)}
    />
  );
}
