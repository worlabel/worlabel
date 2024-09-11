import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/auth/reissue', () => {
    return HttpResponse.json({
      status: 0,
      code: 0,
      message: '토큰 재발급 성공',
      data: { accessToken: 'mockAccessToken' },
      errors: [],
      isSuccess: true,
    });
  }),

  http.get('/api/auth/profile', () => {
    return HttpResponse.json({
      status: 0,
      code: 0,
      message: '프로필 조회 성공',
      data: {
        id: 1,
        nickname: 'mockUser',
        profileImage: 'mockImage.jpg',
      },
      errors: [],
      isSuccess: true,
    });
  }),

  http.get('/api/projects/:projectId', ({ params }) => {
    const { projectId } = params;
    return HttpResponse.json({
      status: 0,
      code: 0,
      message: '프로젝트 조회 성공',
      data: {
        id: Number(projectId),
        title: `Project ${projectId}`,
        workspaceId: 1,
        projectType: 'classification',
        createdAt: '2024-09-10T04:01:37.033Z',
        updatedAt: '2024-09-10T04:01:37.033Z',
      },
      errors: [],
      isSuccess: true,
    });
  }),

  http.put('/api/projects/:projectId', async ({ params, request }) => {
    const { projectId } = params;
    const updateData = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      status: 0,
      code: 0,
      message: '프로젝트 수정 성공',
      data: {
        id: Number(projectId),
        ...updateData,
        workspaceId: 1,
        createdAt: '2024-09-10T04:01:37.033Z',
        updatedAt: new Date().toISOString(),
      },
      errors: [],
      isSuccess: true,
    });
  }),

  http.delete('/api/projects/:projectId', ({ params }) => {
    const { projectId } = params;
    return HttpResponse.json({
      status: 0,
      code: 0,
      message: `프로젝트 ${projectId} 삭제 성공`,
      data: null,
      errors: [],
      isSuccess: true,
    });
  }),

  http.post('/api/projects/:projectId/members', async ({ params, request }) => {
    const { projectId } = params;
    const memberData = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      status: 0,
      code: 0,
      message: `프로젝트 ${projectId} 멤버 추가 성공`,
      data: { ...memberData },
      errors: [],
      isSuccess: true,
    });
  }),

  http.delete('/api/projects/:projectId/members', async ({ params, request }) => {
    const { projectId } = params;
    const memberData = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      status: 0,
      code: 0,
      message: `프로젝트 ${projectId} 멤버 제거 성공`,
      data: { ...memberData },
      errors: [],
      isSuccess: true,
    });
  }),

  http.get('/api/workspaces/:workspaceId/projects', async ({ params, request }) => {
    const { workspaceId } = params;
    const url = new URL(request.url);
    const memberId = url.searchParams.get('memberId');

    if (!memberId) {
      return HttpResponse.json({
        status: 1,
        code: 400,
        message: 'memberId가 필요합니다.',
        data: null,
        errors: [{ field: 'memberId', code: 'missing', message: 'memberId가 필요합니다.', objectName: 'request' }],
        isSuccess: false,
      });
    }

    const dummyProjects = [
      {
        id: 1,
        title: `Project 1`,
        workspaceId: Number(workspaceId),
        projectType: 'classification',
        createdAt: '2024-09-10T04:01:37.049Z',
        updatedAt: '2024-09-10T04:01:37.049Z',
      },
      {
        id: 2,
        title: `Project 2`,
        workspaceId: Number(workspaceId),
        projectType: 'detection',
        createdAt: '2024-09-10T04:02:37.049Z',
        updatedAt: '2024-09-10T04:02:37.049Z',
      },
    ];

    return HttpResponse.json({
      status: 0,
      code: 0,
      message: '프로젝트 목록 조회 성공',
      data: {
        workspaceResponses: dummyProjects, // Adjusted structure to match the expected response type
      },
      errors: [],
      isSuccess: true,
    });
  }),

  http.post('/api/workspaces/:workspaceId/projects', async ({ params, request }) => {
    const { workspaceId } = params;
    const newProject = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      status: 0,
      code: 0,
      message: '프로젝트 생성 성공',
      data: {
        ...newProject,
        workspaceId: Number(workspaceId),
        id: Math.floor(Math.random() * 1000),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      errors: [],
      isSuccess: true,
    });
  }),

  http.get('/api/workspaces/:workspaceId', ({ params }) => {
    const { workspaceId } = params;
    return HttpResponse.json({
      status: 0,
      code: 0,
      message: '워크스페이스 조회 성공',
      data: {
        id: Number(workspaceId),
        memberId: 'member123',
        title: 'workspace1',
        content: '갤럭시 s24 불량 검증',
        createdAt: '2024-09-10T03:46:17.421Z',
        updatedAt: '2024-09-10T03:46:17.421Z',
      },
      errors: [],
      isSuccess: true,
    });
  }),

  http.put('/api/workspaces/:workspaceId', async ({ params, request }) => {
    const { workspaceId } = params;
    const updateData = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      status: 0,
      code: 0,
      message: '워크스페이스 수정 성공',
      data: {
        id: Number(workspaceId),
        ...updateData,
        createdAt: '2024-09-10T03:46:17.421Z',
        updatedAt: new Date().toISOString(),
      },
      errors: [],
      isSuccess: true,
    });
  }),

  http.delete('/api/workspaces/:workspaceId', ({ params }) => {
    const { workspaceId } = params;
    return HttpResponse.json({
      status: 0,
      code: 0,
      message: `워크스페이스 ${workspaceId} 삭제 성공`,
      data: null,
      errors: [],
      isSuccess: true,
    });
  }),

  http.get('/api/workspaces', () => {
    return HttpResponse.json({
      status: 0,
      code: 0,
      message: '전체 워크스페이스 조회 성공',
      data: {
        workspaceResponses: [
          {
            id: 1,
            memberId: 'member123',
            title: 'workspace1',
            content: '갤럭시 s24 불량 검증',
            createdAt: '2024-09-10T03:46:17.428Z',
            updatedAt: '2024-09-10T03:46:17.428Z',
          },
          {
            id: 2,
            memberId: 'member123',
            title: 'workspace2',
            content: '갤럭시 s24 불량 검증',
            createdAt: '2024-09-10T03:46:17.428Z',
            updatedAt: '2024-09-10T03:46:17.428Z',
          },
        ],
      },
      errors: [],
      isSuccess: true,
    });
  }),

  http.post('/api/workspaces', async ({ request }) => {
    const newWorkspace = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      status: 0,
      code: 0,
      message: '워크스페이스 생성 성공',
      data: {
        ...newWorkspace,
        id: Math.floor(Math.random() * 1000),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      errors: [],
      isSuccess: true,
    });
  }),
];
