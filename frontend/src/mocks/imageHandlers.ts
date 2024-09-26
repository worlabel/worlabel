import { http, HttpResponse } from 'msw';
import { ImageMoveRequest, ImageStatusChangeRequest } from '@/types';

export const imageHandlers = [
  // 이미지 조회 핸들러
  http.get('/api/images/:imageId', ({ params }) => {
    const imageId = Array.isArray(params.imageId)
      ? parseInt(params.imageId[0], 10)
      : parseInt(params.imageId as string, 10);
    const memberId = Array.isArray(params.memberId)
      ? parseInt(params.memberId[0], 10)
      : parseInt(params.memberId as string, 10);

    const imageResponse = {
      id: imageId,
      title: `Image ${imageId}`,
      url: `https://example.com/images/${imageId}`,
      memberId,
    };

    return HttpResponse.json(imageResponse);
  }),

  // 이미지 이동 핸들러
  http.put('/api/images/:imageId', async ({ params, request }) => {
    const imageId = Array.isArray(params.imageId)
      ? parseInt(params.imageId[0], 10)
      : parseInt(params.imageId as string, 10);
    const memberId = Array.isArray(params.memberId)
      ? parseInt(params.memberId[0], 10)
      : parseInt(params.memberId as string, 10);

    const moveRequest = (await request.json()) as ImageMoveRequest;

    return HttpResponse.json({
      message: `Image ${imageId} moved to folder ${moveRequest.moveFolderId} by member ${memberId}`,
    });
  }),

  // 이미지 삭제 핸들러
  http.delete('/api/images/:imageId', ({ params }) => {
    const imageId = Array.isArray(params.imageId)
      ? parseInt(params.imageId[0], 10)
      : parseInt(params.imageId as string, 10);
    const memberId = Array.isArray(params.memberId)
      ? parseInt(params.memberId[0], 10)
      : parseInt(params.memberId as string, 10);

    return HttpResponse.json({ message: `Image ${imageId} deleted by member ${memberId}` });
  }),

  // 이미지 상태 변경 핸들러
  http.put('/api/images/:imageId/status', async ({ params, request }) => {
    const imageId = Array.isArray(params.imageId)
      ? parseInt(params.imageId[0], 10)
      : parseInt(params.imageId as string, 10);
    const memberId = Array.isArray(params.memberId)
      ? parseInt(params.memberId[0], 10)
      : parseInt(params.memberId as string, 10);

    const statusChangeRequest = (await request.json()) as ImageStatusChangeRequest;

    return HttpResponse.json({
      message: `Image ${imageId} status changed to ${statusChangeRequest.labelStatus} by member ${memberId}`,
    });
  }),

  // 이미지 파일 업로드 핸들러
  http.post('/api/projects/:projectId/folders/:folderId/images/file', async ({ params, request }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10);
    const folderId = Array.isArray(params.folderId)
      ? parseInt(params.folderId[0], 10)
      : parseInt(params.folderId as string, 10);
    const memberId = Array.isArray(params.memberId)
      ? parseInt(params.memberId[0], 10)
      : parseInt(params.memberId as string, 10);

    const formData = await request.formData();

    const files = formData.getAll('imageList') as File[];

    return HttpResponse.json({
      message: `Uploaded ${files.length} images to folder ${folderId} in project ${projectId} by member ${memberId}`,
    });
  }),

  // 이미지 폴더 업로드 핸들러
  http.post('/api/projects/:projectId/folders/:folderId/images/file', async ({ params, request }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10);
    const memberId = Array.isArray(params.memberId)
      ? parseInt(params.memberId[0], 10)
      : parseInt(params.memberId as string, 10);

    const formData = await request.formData();
    const files = formData.getAll('imageList') as File[];

    return HttpResponse.json({
      message: `Uploaded ${files.length} images to folder 0 in project ${projectId} by member ${memberId}`,
    });
  }),

  // 이미지 ZIP 파일 업로드 핸들러
  http.post('/api/projects/:projectId/folders/:folderId/images/zip', async ({ params, request }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10);
    const memberId = Array.isArray(params.memberId)
      ? parseInt(params.memberId[0], 10)
      : parseInt(params.memberId as string, 10);

    const formData = await request.formData();
    const file = formData.get('folderZip') as File;

    return HttpResponse.json({
      message: `Uploaded zip file "${file.name}" to project ${projectId} by member ${memberId}`,
    });
  }),
];
