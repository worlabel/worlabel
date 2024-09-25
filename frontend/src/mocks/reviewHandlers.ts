import { http, HttpResponse } from 'msw';
import { ReviewDetailResponse, ReviewRequest, ReviewResponse, ReviewStatusRequest } from '@/types';

export const reviewHandlers = [
  // 리뷰 단건 조회 핸들러
  http.get('/api/projects/:projectId/reviews/:reviewId', ({ params }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10);
    const reviewId = Array.isArray(params.reviewId)
      ? parseInt(params.reviewId[0], 10)
      : parseInt(params.reviewId as string, 10);
    console.log(projectId);
    const reviewDetail: ReviewDetailResponse = {
      reviewId: reviewId,
      title: 'Sample Review Title',
      content: 'This is a detailed review content.',
      reviewStatus: 'REQUESTED',
      images: [
        {
          id: 1,
          imageTitle: 'Image 1',
          status: 'PENDING',
          imagePath: 'https://example.com/image1.jpg',
          dataPath: 'https://example.com/data1.json',
        },
      ],
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
      author: { id: 1, nickname: 'Author', profileImage: '', email: 'author@example.com' },
      reviewer: { id: 2, nickname: 'Reviewer', profileImage: '', email: 'reviewer@example.com' },
    };

    return HttpResponse.json(reviewDetail);
  }),

  // 리뷰 생성 핸들러
  http.post('/api/projects/:projectId/reviews', async ({ params, request }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10);
    console.log(projectId);

    const reviewData = (await request.json()) as ReviewRequest;

    const newReview: ReviewResponse = {
      projectId,
      reviewId: Math.floor(Math.random() * 1000), // 임의로 생성된 ID
      title: reviewData.title,
      content: reviewData.content,
      status: 'REQUESTED',
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
      author: { id: 1, nickname: 'Author', profileImage: '', email: 'author@example.com' },
    };

    return HttpResponse.json(newReview);
  }),

  // 리뷰 수정 핸들러
  http.put('/api/projects/:projectId/reviews/:reviewId', async ({ params, request }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10);
    const reviewId = Array.isArray(params.reviewId)
      ? parseInt(params.reviewId[0], 10)
      : parseInt(params.reviewId as string, 10);
    console.log(projectId);

    const reviewData = (await request.json()) as ReviewRequest;

    const updatedReview: ReviewResponse = {
      projectId,
      reviewId,
      title: reviewData.title,
      content: reviewData.content,
      status: 'REQUESTED',
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
      author: { id: 1, nickname: 'Author', profileImage: '', email: 'author@example.com' },
    };

    return HttpResponse.json(updatedReview);
  }),

  // 리뷰 삭제 핸들러
  http.delete('/api/projects/:projectId/reviews/:reviewId', ({ params }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10);
    const reviewId = Array.isArray(params.reviewId)
      ? parseInt(params.reviewId[0], 10)
      : parseInt(params.reviewId as string, 10);

    return HttpResponse.json({ message: `Review ${reviewId} from project ${projectId} deleted successfully.` });
  }),

  // 리뷰 상태 변경 핸들러
  http.put('/api/projects/:projectId/reviews/:reviewId/status', async ({ params, request }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10);
    const reviewId = Array.isArray(params.reviewId)
      ? parseInt(params.reviewId[0], 10)
      : parseInt(params.reviewId as string, 10);
    console.log(projectId);

    const statusRequest = (await request.json()) as ReviewStatusRequest;

    const updatedReview: ReviewResponse = {
      projectId,
      reviewId,
      title: `Updated Review ${reviewId}`,
      content: 'Updated content',
      status: statusRequest.reviewStatus,
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
      author: { id: 1, nickname: 'Author', profileImage: '', email: 'author@example.com' },
    };

    return HttpResponse.json(updatedReview);
  }),

  http.get('/api/projects/:projectId/reviews', ({ params }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10);

    const reviewStatus = Array.isArray(params.reviewStatus) ? params.reviewStatus[0] : params.reviewStatus;

    const lastReviewId = Array.isArray(params.lastReviewId)
      ? parseInt(params.lastReviewId[0], 10)
      : parseInt(params.lastReviewId as string, 10) || 0;

    const limitPage = Array.isArray(params.limitPage)
      ? parseInt(params.limitPage[0], 10)
      : parseInt(params.limitPage as string, 10) || 10;

    // 총 100개의 리뷰를 생성
    const totalReviews = 100;
    const reviews: ReviewResponse[] = Array.from({ length: totalReviews }, (_, index) => ({
      projectId,
      reviewId: index + 1,
      title: `Review ${index + 1}`,
      content: `Review content ${index + 1}`,
      status: (reviewStatus || 'REQUESTED') as 'REQUESTED' | 'APPROVED' | 'REJECTED',
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
      author: { id: 1, nickname: 'Author', profileImage: '', email: 'author@example.com' },
    }));

    // 마지막 리뷰 ID 기준으로 데이터를 잘라서 반환
    const startIndex = lastReviewId > 0 ? lastReviewId : 0;
    const slicedReviews = reviews.slice(startIndex, startIndex + limitPage);

    return HttpResponse.json(slicedReviews);
  }),
];
