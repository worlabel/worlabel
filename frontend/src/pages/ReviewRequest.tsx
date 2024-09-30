import { useNavigate } from 'react-router-dom';
import useCreateReviewQuery from '@/queries/reviews/useCreateReviewQuery';
import useAuthStore from '@/stores/useAuthStore';
import { useParams } from 'react-router-dom';
import ReviewForm from '@/components/ReviewForm';
import useReviewRequest from '@/hooks/useReviewRequest';

export default function ReviewRequest(): JSX.Element {
  const { profile } = useAuthStore((state) => state);
  const memberId = profile?.id ?? 0;
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId?: string }>();

  const { projects } = useReviewRequest();
  const createReview = useCreateReviewQuery();

  const handleReviewSubmit = (data: { projectId: string; title: string; content: string; imageIds: number[] }) => {
    const reviewData = {
      title: data.title,
      content: data.content,
      imageIds: data.imageIds,
    };

    createReview.mutate(
      {
        projectId: Number(data.projectId),
        memberId,
        reviewData,
      },
      {
        onSuccess: () => navigate(`/admin/${workspaceId}/reviews`),
      }
    );
  };

  return (
    <div className="review-request-container p-4">
      <h1 className="mb-4 text-2xl font-bold">리뷰 요청</h1>

      <ReviewForm
        projects={projects.map((project) => ({ id: project.id.toString(), title: project.title }))}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
