import { http, HttpResponse } from 'msw';
import { WorkspaceResponse, WorkspaceListResponse, ReviewResponse, WorkspaceMemberResponse } from '@/types';

export const workspaceHandlers = [
  // 워크스페이스 조회 핸들러
  http.get('/api/workspaces/:workspaceId', ({ params }) => {
    const { workspaceId } = params;
    const response: WorkspaceResponse = {
      id: parseInt(workspaceId as string, 10),
      memberId: 'abc1324',
      title: 'workspace1',
      content: '갤럭시 s24 불량 검증',
      createdAt: '2024-09-18T05:04:44.668Z',
      updatedAt: '2024-09-18T05:04:44.668Z',
    };
    return HttpResponse.json(response);
  }),

  // 워크스페이스 수정 핸들러
  http.put('/api/workspaces/:workspaceId', ({ params }) => {
    const { workspaceId } = params;
    const response: WorkspaceResponse = {
      id: parseInt(workspaceId as string, 10),
      memberId: 'abc1324',
      title: 'Updated Workspace Title',
      content: 'Updated Workspace Content',
      createdAt: '2024-09-18T05:04:44.668Z',
      updatedAt: '2024-09-18T06:00:00.668Z',
    };
    return HttpResponse.json(response);
  }),

  // 워크스페이스 삭제 핸들러
  http.delete('/api/workspaces/:workspaceId', ({ params }) => {
    const { workspaceId } = params;
    console.log(`Workspace ${workspaceId} deleted`);
    return HttpResponse.json({});
  }),

  http.get('/api/workspaces', () => {
    console.log('워크스페이스 목록 전체 조회');

    const workspaces: WorkspaceListResponse = {
      workspaceResponses: [
        {
          id: 1,
          memberId: 'abc1324',
          title: 'Workspace 1',
          content: 'Content 1',
          createdAt: '2024-09-18T05:04:44.668Z',
          updatedAt: '2024-09-18T05:04:44.668Z',
        },
        {
          id: 2,
          memberId: 'xyz5678',
          title: 'Workspace 2',
          content: 'Content 2',
          createdAt: '2024-09-19T05:04:44.668Z',
          updatedAt: '2024-09-19T05:04:44.668Z',
        },
      ],
    };

    return HttpResponse.json(workspaces);
  }),
  // 워크스페이스 멤버 추가 핸들러
  http.post('/api/workspaces/:workspaceId/members/:newMemberId', async ({ params }) => {
    const workspaceId = Array.isArray(params.workspaceId)
      ? parseInt((params.workspaceId as string[])[0], 10)
      : parseInt(params.workspaceId as string, 10);
    const newMemberId = Array.isArray(params.newMemberId)
      ? parseInt((params.newMemberId as string[])[0], 10)
      : parseInt(params.newMemberId as string, 10);
    console.log(workspaceId);
    const addedMember: WorkspaceMemberResponse = {
      id: newMemberId,
      nickname: `Member${newMemberId}`,
      profileImage: `profile${newMemberId}.jpg`,
    };

    return HttpResponse.json(addedMember);
  }),

  // 워크스페이스 멤버 삭제 핸들러
  http.delete('/api/workspaces/:workspaceId/members/:targetMemberId', ({ params }) => {
    const workspaceId = Array.isArray(params.workspaceId)
      ? parseInt((params.workspaceId as string[])[0], 10)
      : parseInt(params.workspaceId as string, 10);
    const targetMemberId = Array.isArray(params.targetMemberId)
      ? parseInt((params.targetMemberId as string[])[0], 10)
      : parseInt(params.targetMemberId as string, 10);

    return HttpResponse.json({ message: `Member ${targetMemberId} removed from workspace ${workspaceId}` });
  }),

  // 워크스페이스 멤버 조회 핸들러
  http.get('/api/workspaces/:workspaceId/members', ({ params }) => {
    const workspaceId = Array.isArray(params.workspaceId)
      ? parseInt((params.workspaceId as string[])[0], 10)
      : parseInt(params.workspaceId as string, 10);
    console.log(workspaceId);

    const members: WorkspaceMemberResponse[] = [
      {
        id: 1,
        nickname: 'adminUser',
        profileImage: 'admin.jpg',
      },
      {
        id: 2,
        nickname: 'managerUser',
        profileImage: 'manager.jpg',
      },
      {
        id: 3,
        nickname: 'editorUser',
        profileImage: 'editor.jpg',
      },
    ];

    return HttpResponse.json(members);
  }),

  // 워크스페이스 리뷰 조회 핸들러
  http.get('/api/workspaces/:workspaceId/reviews', ({ params }) => {
    const workspaceId = Array.isArray(params.workspaceId)
      ? parseInt((params.workspaceId as string[])[0], 10)
      : parseInt(params.workspaceId as string, 10);
    console.log(workspaceId);

    const reviews: ReviewResponse[] = [
      {
        reviewId: 1,
        projectId: 1,
        title: 'First Review',
        content: 'This is a review content.',
        status: 'APPROVED',
        author: {
          id: 1,
          nickname: 'Reviewer1',
          profileImage: 'reviewer1.jpg',
          email: 'reviewer1@example.com',
        },
        createAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
      },
      {
        reviewId: 2,
        projectId: 2,
        title: 'Second Review',
        content: 'This is another review content.',
        status: 'REQUESTED',
        author: {
          id: 2,
          nickname: 'Reviewer2',
          profileImage: 'reviewer2.jpg',
          email: 'reviewer2@example.com',
        },
        createAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
      },
    ];

    return HttpResponse.json(reviews);
  }),
];
