import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useCreateReviewQuery from '@/queries/reviews/useCreateReviewQuery';
import type { ReviewRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useAuthStore from '@/stores/useAuthStore';
import useProjectListQuery from '@/queries/projects/useProjectListQuery';
import ImageSelection from '@/components/ImageSelection';

export default function ReviewRequest(): JSX.Element {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const { data: projects } = useProjectListQuery(Number(workspaceId), memberId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewRequest>();
  const createReview = useCreateReviewQuery();

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
          navigate(`/admin/${workspaceId}/reviews`);
        },
      }
    );
  };

  return (
    <div className="review-request-container p-4">
      <h1 className="mb-4 text-2xl font-bold">리뷰 요청</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label htmlFor="project">프로젝트 선택</Label>
          <Select onValueChange={(value) => setSelectedProjectId(value)}>
            <SelectTrigger id="project">
              <SelectValue placeholder="프로젝트를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {projects.length ? (
                projects.map((project) => (
                  <SelectItem
                    key={project.id}
                    value={project.id.toString()}
                  >
                    {project.title}
                  </SelectItem>
                ))
              ) : (
                <SelectItem
                  disabled
                  value={'true'}
                >
                  프로젝트가 없습니다
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Label htmlFor="title">제목</Label>
          <Input
            id="title"
            placeholder="리뷰 제목을 입력하세요"
            {...register('title', { required: '제목을 입력해주세요.' })}
          />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>

        <div className="mb-4">
          <Label htmlFor="content">내용</Label>
          <Textarea
            id="content"
            placeholder="리뷰 내용을 입력하세요"
            {...register('content', { required: '내용을 입력해주세요.' })}
          />
          {errors.content && <p className="text-red-500">{errors.content.message}</p>}
        </div>

        {selectedProjectId && (
          <ImageSelection
            projectId={selectedProjectId}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
          />
        )}

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
            type="submit"
            disabled={!selectedProjectId}
          >
            리뷰 요청
          </Button>
        </div>
      </form>
    </div>
  );
}
