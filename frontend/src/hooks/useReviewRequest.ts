import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';
import useProjectListQuery from '@/queries/projects/useProjectListQuery';
import useCreateReviewQuery from '@/queries/reviews/useCreateReviewQuery';
import type { ReviewRequest } from '@/types';

export default function useReviewRequest() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const { data: projects } = useProjectListQuery(Number(workspaceId), memberId);
  const createReview = useCreateReviewQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewRequest>();

  const onSubmit = (data: ReviewRequest) => {
    if (!selectedProjectId) {
      return;
    }
    createReview.mutate(
      {
        projectId: Number(selectedProjectId),
        memberId,
        reviewData: {
          ...data,
          imageIds: selectedImages,
        },
      },
      {
        onSuccess: () => {
          navigate(`/review/${workspaceId}`);
        },
      }
    );
  };

  return {
    register,
    handleSubmit,
    errors,
    projects,
    onSubmit,
    selectedProjectId,
    setSelectedProjectId,
    selectedImages,
    setSelectedImages,
  };
}
