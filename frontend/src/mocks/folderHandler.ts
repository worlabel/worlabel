import { http, HttpResponse } from 'msw';
import { FolderResponse, FolderRequest } from '@/types';

export const folderHandlers = [
  // 특정 폴더 조회 핸들러
  http.get('/api/projects/:projectId/folders/:folderId', ({ params }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10); // string으로 캐스팅
    const folderId = Array.isArray(params.folderId)
      ? parseInt(params.folderId[0], 10)
      : parseInt(params.projectId as string, 10);
    console.log(projectId);

    const folderResponse: FolderResponse = {
      id: folderId,
      title: `Folder ${folderId}`,
      images: [
        {
          id: 1,
          imageTitle: 'image1.jpg',
          imagePath: 'https://example.com/image1.jpg',
          dataPath: 'https://example.com/data1.json',
          status: 'SAVE',
        },
      ],
      children: [
        {
          id: 1,
          title: 'Subfolder 1',
        },
      ],
    };

    return HttpResponse.json(folderResponse);
  }),

  // 폴더 생성 핸들러
  http.post('/api/projects/:projectId/folders', async ({ params, request }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10); // string으로 캐스팅

    const folderData = (await request.json()) as FolderRequest;

    const createdFolder: FolderResponse = {
      id: Math.floor(Math.random() * 1000), // 임의로 폴더 ID 생성
      title: folderData.title,
      images: [],
      children: [],
    };
    console.log(projectId);

    return HttpResponse.json(createdFolder);
  }),

  // 폴더 수정 핸들러
  http.put('/api/projects/:projectId/folders/:folderId', async ({ params, request }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10); // string으로 캐스팅
    const folderId = Array.isArray(params.folderId)
      ? parseInt(params.folderId[0], 10)
      : parseInt(params.projectId as string, 10);
    console.log(projectId);
    const folderData = (await request.json()) as FolderRequest;

    const updatedFolder: FolderResponse = {
      id: folderId,
      title: folderData.title,
      images: [],
      children: [],
    };

    return HttpResponse.json(updatedFolder);
  }),

  // 폴더 삭제 핸들러
  http.delete('/api/projects/:projectId/folders/:folderId', ({ params }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10); // string으로 캐스팅
    const folderId = Array.isArray(params.folderId)
      ? parseInt(params.folderId[0], 10)
      : parseInt(params.projectId as string, 10);
    return HttpResponse.json({ message: `Folder ${folderId} deleted from project ${projectId}` });
  }),

  // 폴더 리뷰 목록 조회 핸들러
  http.get('/api/projects/:projectId/folders/:folderId/review', ({ params }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10);
    const folderId = Array.isArray(params.folderId)
      ? parseInt(params.folderId[0], 10)
      : parseInt(params.projectId as string, 10);
    console.log(projectId, folderId);
    const reviews = [
      {
        reviewId: 1,
        title: 'First Review',
        content: 'Review for the first folder',
        status: 'APPROVED',
      },
      {
        reviewId: 2,
        title: 'Second Review',
        content: 'Review for the second folder',
        status: 'REQUESTED',
      },
    ];

    return HttpResponse.json(reviews);
  }),
];
