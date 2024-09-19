import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import useReviewDetailQuery from '@/queries/reviews/useReviewDetailQuery';
import useUpdateReviewStatusQuery from '@/queries/reviews/useUpdateReviewStatusQuery';
import useProjectMembersQuery from '@/queries/projects/useProjectMembersQuery';
import useAuthStore from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function ReviewDetail(): JSX.Element {
  const { projectId, reviewId } = useParams<{ projectId: string; reviewId: string }>();
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const { data: reviewDetail } = useReviewDetailQuery(Number(projectId), Number(reviewId), memberId);
  const { data: projectMembers } = useProjectMembersQuery(Number(projectId), memberId);

  const updateReviewStatus = useUpdateReviewStatusQuery();
  const [activeTab, setActiveTab] = useState<'content' | 'images'>('content');

  const handleApprove = () => {
    updateReviewStatus.mutate({
      projectId: Number(projectId),
      reviewId: Number(reviewId),
      memberId,
      reviewStatus: 'APPROVED',
    });
  };

  const handleReject = () => {
    updateReviewStatus.mutate({
      projectId: Number(projectId),
      reviewId: Number(reviewId),
      memberId,
      reviewStatus: 'REJECTED',
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
          작성자: {reviewDetail.nickname} ({reviewDetail.email})
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
                    <img
                      src={image.imagePath}
                      alt="리뷰 이미지"
                      className="h-auto w-full rounded"
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

      {reviewDetail.reviewStatus === 'APPROVED' && (
        <div className="reviewer-info mt-6">
          <h2 className="text-lg font-semibold">리뷰어</h2>
          <div className="flex items-center">
            <img
              src={reviewDetail.reviewerProfileImage}
              alt="리뷰어 프로필"
              className="h-10 w-10 rounded-full"
            />
            <div className="ml-4">
              <p className="font-bold">{reviewDetail.reviewerNickname}</p>
              <p className="text-gray-500">{reviewDetail.reviewerEmail}</p>
            </div>
          </div>
        </div>
      )}

      <div className="meta-info mt-6">
        <h2 className="text-lg font-semibold">프로젝트 멤버</h2>
        <ul className="list-disc pl-6">
          {projectMembers.map((member) => (
            <li
              key={member.memberId}
              className="text-gray-700"
            >
              {member.nickname} - {member.privilegeType}
            </li>
          ))}
        </ul>
      </div>

      <div className="actions mt-6 flex justify-end space-x-2">
        {reviewDetail.reviewStatus !== 'APPROVED' && (
          <Button
            variant="default"
            onClick={handleApprove}
          >
            승인
          </Button>
        )}
        {reviewDetail.reviewStatus !== 'REJECTED' && (
          <Button
            variant="destructive"
            onClick={handleReject}
          >
            거부
          </Button>
        )}
      </div>
    </div>
  );
}
