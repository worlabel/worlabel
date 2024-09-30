import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Slider from 'react-slick';
import useReviewDetailQuery from '@/queries/reviews/useReviewDetailQuery';
import useApproveReviewQuery from '@/queries/reviews/useApproveReviewQuery';
import useRejectReviewQuery from '@/queries/reviews/useRejectReviewQuery';
import useAuthStore from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ImageWithLabels from '@/components/ImageWithLabels';

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
      <div className="header mb-4">
        <h1 className="text-2xl font-bold">{reviewDetail.title}</h1>
        <p className="text-sm text-gray-500">
          작성자: {reviewDetail.author.nickname} ({reviewDetail.author.email})
        </p>
        <p className="text-sm text-gray-500">작성일: {new Date(reviewDetail.createAt).toLocaleDateString()}</p>
        <p className="text-sm text-gray-500">수정일: {new Date(reviewDetail.updateAt).toLocaleDateString()}</p>
      </div>

      <div className="relative w-full px-4">
        <div className="flex w-full items-center border-b-[0.67px] border-solid border-[#dcdcde]">
          {['content', 'images'].map((tab) => (
            <button
              key={tab}
              className={`flex h-12 w-[100px] items-center justify-center px-3 ${
                activeTab === tab ? 'shadow-[inset_0px_-2px_0px_#1f75cb]' : ''
              }`}
              onClick={() => setActiveTab(tab as 'content' | 'images')}
            >
              <span className={`text-sm ${activeTab === tab ? 'font-semibold' : 'font-normal'} text-[#333238]`}>
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

      {(reviewDetail.reviewStatus === 'APPROVED' || reviewDetail.reviewStatus === 'REJECTED') && (
        <div className="reviewer-info mt-6">
          <h2 className="text-lg font-semibold">
            리뷰 상태: {reviewDetail.reviewStatus === 'APPROVED' ? '승인됨' : '거부됨'}
          </h2>
          <div className="flex items-center">
            <img
              src={reviewDetail.reviewer.profileImage}
              alt="리뷰어 프로필"
              className="h-10 w-10 rounded-full"
            />
            <div className="ml-4">
              <p className="font-bold">{reviewDetail.reviewer.nickname}</p>
              <p className="text-gray-500">{reviewDetail.reviewer.email}</p>
              <p className="text-gray-500">
                {reviewDetail.reviewStatus === 'APPROVED' ? '승인한 사람:' : '거부한 사람:'}{' '}
                {reviewDetail.reviewer.nickname}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 flex justify-end gap-2">
        <Link to={`/admin/${workspaceId}/reviews`}>
          <Button variant="black">목록으로 돌아가기</Button>
        </Link>
        {reviewDetail.reviewStatus !== 'APPROVED' && reviewDetail.reviewStatus !== 'REJECTED' && (
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
