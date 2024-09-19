import useReviewDetailQuery from '@/queries/reviews/useReviewDetailQuery';
import useUpdateReviewQuery from '@/queries/reviews/useUpdateReviewQuery';
import useDeleteReviewQuery from '@/queries/reviews/useDeleteReviewQuery';
import { useParams } from 'react-router-dom';

export default function ReviewDetail() {
  const { projectId, reviewId } = useParams<{ projectId: string; reviewId: string }>();
  const memberId = 1;

  const { data: reviewDetail } = useReviewDetailQuery(Number(projectId), Number(reviewId), memberId);
  const updateReview = useUpdateReviewQuery();
  const deleteReview = useDeleteReviewQuery();

  const handleUpdate = () => {
    updateReview.mutate({
      projectId: Number(projectId),
      reviewId: Number(reviewId),
      memberId,
      reviewData: {
        title: reviewDetail.title,
        content: reviewDetail.content,
        imageIds: reviewDetail.images.map((image) => image.id),
      },
    });
  };

  const handleDelete = () => {
    deleteReview.mutate({
      projectId: Number(projectId),
      reviewId: Number(reviewId),
      memberId,
    });
  };

  if (!reviewDetail) return <p>Loading...</p>;

  const { title, content, reviewStatus, images } = reviewDetail;

  return (
    <div className="flex flex-col gap-4 bg-white p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#333238]">{title}</h1>
        <div className="rounded-full bg-[#cbe2f9] px-3 py-0.5 text-xs text-[#0b5cad]">{reviewStatus}</div>
      </header>

      <div className="flex items-center gap-2">
        <p className="text-sm text-[#737278]">by 김용수</p>
        <p className="text-sm text-[#737278]">|</p>
        <p className="text-sm text-[#737278]">8 hours ago</p>
      </div>

      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold">내용</h2>
        <p className="mt-2 text-sm text-[#333238]">{content}</p>
      </div>

      <div className="flex flex-col">
        <h2 className="text-xl font-semibold">이미지 목록</h2>
        <ul className="mt-2 list-inside list-disc">
          {images.map((image) => (
            <li
              key={image.id}
              className="text-sm text-[#737278]"
            >
              {image.imageTitle} (status: {image.status})
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleUpdate}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          수정하기
        </button>
        <button
          onClick={handleDelete}
          className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          삭제하기
        </button>
      </div>
    </div>
  );
}
