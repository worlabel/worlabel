import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import useCreateReviewQuery from '@/queries/reviews/useCreateReviewQuery';
import useAuthStore from '@/stores/useAuthStore';
import { useParams } from 'react-router-dom';
import ReviewForm from '@/components/ReviewForm';
import useReviewRequest from '@/hooks/useReviewRequest';
import { useState } from 'react';
export default function ReviewRequest(): JSX.Element {
  const { profile } = useAuthStore((state) => state);
  const memberId = profile?.id ?? 0;
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId?: string }>();

  const { projects, selectedProjectId, setSelectedProjectId, selectedImages, setSelectedImages } = useReviewRequest();

  const handleSuccess = () => {
    navigate(`/admin/${workspaceId}/reviews`);
  };

  const createReview = useCreateReviewQuery();

  const [formData, setFormData] = useState<{ title: string; content: string } | null>(null);

  const handleReviewSubmit = (data: { title: string; content: string }) => {
    setFormData(data);
  };

  const handleButtonClick = () => {
    if (!formData) return;

    const reviewData = {
      title: formData.title,
      content: formData.content,
      imageIds: selectedImages,
    };

    createReview.mutate(
      {
        projectId: Number(selectedProjectId),
        memberId,
        reviewData,
      },
      {
        onSuccess: handleSuccess,
      }
    );
  };

  return (
    <div className="review-request-container p-4">
      <h1 className="mb-4 text-2xl font-bold">리뷰 요청</h1>

      <ReviewForm
        projects={projects.map((project) => ({ id: project.id.toString(), title: project.title }))}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        onSubmit={handleReviewSubmit}
      />

      <div className="actions mt-6 flex justify-end space-x-2">
        <Button
          variant="destructive"
          type="button"
          onClick={() => navigate(-1)}
        >
          취소
        </Button>
        <Button
          variant="default"
          onClick={handleButtonClick} // 버튼 클릭 시에만 mutate 실행
          disabled={!selectedProjectId || !formData}
        >
          리뷰 요청
        </Button>
      </div>
    </div>
  );
}
