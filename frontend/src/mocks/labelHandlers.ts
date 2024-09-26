import { http, HttpResponse } from 'msw';

export const labelHandlers = [
  // 이미지 레이블 저장 핸들러
  http.post('/api/projects/:projectId/images/:imageId/label', async ({ params, request }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10);
    const imageId = Array.isArray(params.imageId)
      ? parseInt(params.imageId[0], 10)
      : parseInt(params.imageId as string, 10);

    const labelData = (await request.json()) as { data: string };

    return HttpResponse.json({
      message: `Label saved for image ${imageId} in project ${projectId}`,
      labelData: labelData.data,
    });
  }),

  // 자동 레이블링 실행 핸들러
  http.post('/api/projects/:projectId/label/auto', ({ params }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10);
    const memberId = Array.isArray(params.memberId)
      ? parseInt(params.memberId[0], 10)
      : parseInt(params.memberId as string, 10);

    // 여기에서는 예를 들어 자동 레이블링 작업이 성공적으로 완료된 상황을 가정합니다.
    return HttpResponse.json({
      message: `Auto-labeling started for project ${projectId} by member ${memberId}`,
      status: 'IN_PROGRESS',
    });
  }),
];
