import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Slider from 'react-slick';
import useReviewDetailQuery from '@/queries/reviews/useReviewDetailQuery';
import useApproveReviewQuery from '@/queries/reviews/useApproveReviewQuery';
import useRejectReviewQuery from '@/queries/reviews/useRejectReviewQuery';
import useAuthStore from '@/stores/useAuthStore';
import useIsAdminOrManager from '@/hooks/useIsAdminOrManager';
import { Button } from '@/components/ui/button';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ImageWithLabels from '@/components/ImageWithLabels';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import formatDateTime from '@/utils/formatDateTime';
import timeAgo from '@/utils/timeAgo';

export default function ReviewDetail(): JSX.Element {
  const { workspaceId, projectId, reviewId } = useParams<{
    workspaceId: string;
    projectId: string;
    reviewId: string;
  }>();
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const { data: reviewDetail } = useReviewDetailQuery(Number(projectId), Number(reviewId), memberId);

  const approveReviewMutation = useApproveReviewQuery({
    projectId: Number(projectId),
    reviewId: Number(reviewId),
    memberId: memberId,
  });
  const rejectReviewMutation = useRejectReviewQuery({
    projectId: Number(projectId),
    reviewId: Number(reviewId),
    memberId: memberId,
  });

  const [activeTab, setActiveTab] = useState<'content' | 'images'>('content');

  const isAdminOrManager = useIsAdminOrManager(Number(projectId));

  const handleApprove = () => {
    approveReviewMutation.mutate(undefined, {
      onSuccess: () => {},
    });
  };

  const handleReject = () => {
    rejectReviewMutation.mutate(undefined, {
      onSuccess: () => {},
    });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="review-detail-container p-4">
      <div className="header mb-4 flex flex-col gap-1">
        <h1 className="heading mb-2">{reviewDetail.title}</h1>
        <div className="mb-1 flex gap-1">
          <div
            className={cn(
              'caption mr-1 flex items-center gap-1 rounded-full px-3 py-0.5',
              reviewDetail.reviewStatus === 'APPROVED'
                ? 'bg-green-100 text-green-600'
                : reviewDetail.reviewStatus === 'REJECTED'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-blue-100 text-blue-600'
            )}
          >
            {reviewDetail.reviewStatus === 'APPROVED' ? (
              <Check size={12} />
            ) : reviewDetail.reviewStatus === 'REJECTED' ? (
              <X size={12} />
            ) : (
              <></>
            )}
            {reviewDetail.reviewStatus}
          </div>
          {reviewDetail.reviewStatus === 'APPROVED' || reviewDetail.reviewStatus === 'REJECTED' ? (
            <>
              <p className="body-small text-gray-500">by</p>
              <p className="body-small-strong text-gray-500">
                {reviewDetail.reviewer.nickname} ({reviewDetail.reviewer.email})
              </p>
            </>
          ) : (
            <p className="body-small text-gray-500">updated</p>
          )}

          <p className="body-small-strong text-gray-500">{timeAgo(reviewDetail.updatedAt)}</p>
          <p className="body-small text-gray-500">({formatDateTime(reviewDetail.updatedAt)})</p>
        </div>
        <div className="flex gap-1">
          <p className="body-small-strong text-gray-500">
            {reviewDetail.author.nickname} ({reviewDetail.author.email})
          </p>
          <p className="body-small text-gray-500">requested a review</p>
          <p className="body-small-strong text-gray-500">{timeAgo(reviewDetail.createdAt)}</p>
          <p className="body-small text-gray-500">({formatDateTime(reviewDetail.createdAt)})</p>
        </div>
      </div>

      <div className="relative w-full">
        <div className="flex w-full items-center border-b-[1px] border-solid border-gray-300">
          {['content', 'images'].map((tab) => (
            <button
              key={tab}
              className={`flex h-12 w-[100px] items-center justify-center px-3 ${
                activeTab === tab ? 'border-b-[3px] border-blue-500' : 'border-b-[3px] border-transparent'
              }`}
              onClick={() => setActiveTab(tab as 'content' | 'images')}
            >
              <span className={`text-sm ${activeTab === tab ? 'font-semibold' : 'font-normal'} text-black`}>
                {tab === 'content' ? '내용' : '이미지'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="content mt-4">
        {activeTab === 'content' ? (
          <p className="text-gray-700">{reviewDetail.content}</p>
        ) : (
          <div className="images mt-4">
            {reviewDetail.images.length > 0 ? (
              <Slider {...settings}>
                {reviewDetail.images.map((image) => (
                  <div key={image.id}>
                    <ImageWithLabels
                      imagePath={image.imagePath}
                      labelData={image.dataPath}
                      projectId={Number(projectId)}
                      imageId={image.id}
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <p className="text-gray-500">이미지가 없습니다.</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Link to={`/admin/${workspaceId}/reviews`}>
          <Button variant="black">목록으로 돌아가기</Button>
        </Link>
        {isAdminOrManager && reviewDetail.reviewStatus !== 'APPROVED' && reviewDetail.reviewStatus !== 'REJECTED' && (
          <>
            <Button
              variant="red"
              onClick={handleReject}
            >
              {'거부'}
            </Button>
            <Button
              variant="blue"
              onClick={handleApprove}
            >
              {'승인'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
