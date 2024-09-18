import { http, HttpResponse } from 'msw';
import {
  ProjectResponse,
  FolderResponse,
  ImageResponse,
  WorkspaceResponse,
  MemberResponse,
  RefreshTokenResponse,
  AutoLabelingResponse,
  ProjectListResponse,
  ErrorResponse,
} from '@/types';

export const handlers = [
  // Auth Handlers
  http.post('/api/auth/reissue', () => {
    // 토큰 재발급 핸들러
    const response: RefreshTokenResponse = {
      accessToken: 'newAccessToken',
    };
    return HttpResponse.json(response);
  }),

  http.get('/api/auth/profile', () => {
    // 사용자 프로필 핸들러
    const response: MemberResponse = {
      id: 1,
      nickname: 'javajoha',
      profileImage: 'profile.jpg',
    };
    return HttpResponse.json(response);
  }),

  // Workspace Handlers
  http.get('/api/workspaces/:workspaceId', ({ params }) => {
    // 워크스페이스 조회 핸들러
    const { workspaceId } = params;
    const response: WorkspaceResponse = {
      id: parseInt(workspaceId as string, 10),
      memberId: 1,
      title: 'workspace1',
      content: '갤럭시 s24 불량 검증',
      createdAt: '2024-09-18T05:04:44.668Z',
      updatedAt: '2024-09-18T05:04:44.668Z',
    };
    return HttpResponse.json(response);
  }),

  http.put('/api/workspaces/:workspaceId', ({ params }) => {
    // 워크스페이스 수정 핸들러
    const { workspaceId } = params;
    const response: WorkspaceResponse = {
      id: parseInt(workspaceId as string, 10),
      memberId: 1,
      title: 'Updated Workspace Title',
      content: 'Updated Workspace Content',
      createdAt: '2024-09-18T05:04:44.668Z',
      updatedAt: '2024-09-18T06:00:00.668Z',
    };
    return HttpResponse.json(response);
  }),

  http.delete('/api/workspaces/:workspaceId', ({ params }) => {
    const { workspaceId } = params;
    console.log(workspaceId);
    return HttpResponse.json({});
  }),

  http.get('/api/workspaces', () => {
    // 워크스페이스 목록 조회 핸들러
    const response: WorkspaceResponse[] = [
      {
        id: 1,
        memberId: 1,
        title: 'Workspace 1',
        content: 'Content 1',
        createdAt: '2024-09-18T05:04:44.668Z',
        updatedAt: '2024-09-18T05:04:44.668Z',
      },
    ];
    return HttpResponse.json(response);
  }),

  // Project Handlers
  http.get('/api/workspaces/:workspaceId/projects', ({ request, params }) => {
    const workspaceId = parseInt(params.workspaceId as string, 10);

    const url = new URL(request.url);
    const lastProjectId = parseInt(url.searchParams.get('lastProjectId') || '0', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    const projects: ProjectResponse[] = Array.from({ length: limit }, (_, index) => ({
      id: lastProjectId + index + 1,
      title: `프로젝트 ${lastProjectId + index + 1}`,
      workspaceId,
      projectType: ['classification', 'detection', 'segmentation'][index % 3] as
        | 'classification'
        | 'detection'
        | 'segmentation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // 응답 생성
    const response: ProjectListResponse = {
      workspaceResponses: projects,
    };

    return HttpResponse.json(response);
  }),
  http.get('/api/projects/:projectId', ({ params }) => {
    // 프로젝트 조회 핸들러
    const { projectId } = params;
    const response: ProjectResponse = {
      id: parseInt(projectId as string, 10),
      title: 'Project Title',
      workspaceId: 1,
      projectType: 'classification',
      createdAt: '2024-09-18T05:04:44.668Z',
      updatedAt: '2024-09-18T05:04:44.668Z',
    };
    return HttpResponse.json(response);
  }),

  http.post('/api/workspaces/:workspaceId/projects', () => {
    // 프로젝트 생성 핸들러
    const response: ProjectResponse = {
      id: 3,
      title: 'New Project',
      workspaceId: 1,
      projectType: 'detection',
      createdAt: '2024-09-18T05:04:44.668Z',
      updatedAt: '2024-09-18T05:04:44.668Z',
    };
    return HttpResponse.json(response);
  }),

  http.put('/api/projects/:projectId', ({ params }) => {
    // 프로젝트 수정 핸들러
    const { projectId } = params;
    const response: ProjectResponse = {
      id: parseInt(projectId as string, 10),
      title: 'Updated Project Title',
      workspaceId: 1,
      projectType: 'segmentation',
      createdAt: '2024-09-18T05:04:44.668Z',
      updatedAt: '2024-09-18T06:00:00.668Z',
    };
    return HttpResponse.json(response);
  }),

  http.delete('/api/projects/:projectId', ({ params }) => {
    const { projectId } = params;
    console.log(projectId);
    return HttpResponse.json({});
  }),

  // Folder and Image Handlers
  http.get('/api/projects/:projectId/folders/:folderId', ({ params }) => {
    const { folderId } = params;
    const response: FolderResponse = {
      id: parseInt(folderId as string, 10),
      title: 'My Folder',
      images: [
        {
          id: 1,
          imageTitle: 'image.jpg',
          imageUrl: 'https://example.com/image.jpg',
          status: 'PENDING',
        },
        {
          id: 2,
          imageTitle: 'another_image.jpg',
          imageUrl: 'https://example.com/another_image.jpg',
          status: 'IN_PROGRESS',
        },
      ],
      children: [
        {
          id: 1,
          title: 'Car',
        },
        {
          id: 2,
          title: 'Bike',
        },
      ],
    };
    return HttpResponse.json(response);
  }),

  http.get('/api/projects/:projectId/folders/:folderId/images/:imageId', ({ params }) => {
    // 이미지 조회 핸들러
    const { imageId } = params;
    const response: ImageResponse = {
      id: parseInt(imageId as string, 10),
      imageTitle: 'Image Title',
      imageUrl: 'image-url.jpg',
      status: 'PENDING',
    };
    return HttpResponse.json(response);
  }),

  // Auto Labeling Handler
  http.post('/api/projects/:projectId/label/auto', () => {
    const response: AutoLabelingResponse = {
      imageId: 1,
      imageUrl: 'image-url.jpg',
      data: `{
        "version": "0.1.0",
        "task_type": "cls",
        "shapes": [
          {
            "label": "NG",
            "color": "#FF0000",
            "points": [[0, 0]],
            "group_id": null,
            "shape_type": "point",
            "flags": {}
          }
        ],
        "split": "none",
        "imageHeight": 2000,
        "imageWidth": 4000,
        "imageDepth": 4
      }`,
    };
    return HttpResponse.json(response);
  }),

  // Error Handler Example
  http.get('/api/error', () => {
    const errorResponse: ErrorResponse = {
      status: 400,
      code: 1003,
      message: '필수 요청 파라미터가 입력되지 않았습니다.',
      isSuccess: false,
    };
    return HttpResponse.json(errorResponse);
  }),
];
