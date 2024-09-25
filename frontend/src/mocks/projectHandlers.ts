import { http, HttpResponse } from 'msw';
import { ProjectMemberResponse, ProjectResponse } from '@/types';

export const projectHandlers = [
  // 프로젝트 목록 조회 핸들러
  http.get('/api/workspaces/:workspaceId/projects', ({ params, request }) => {
    const workspaceId = Array.isArray(params.workspaceId)
      ? parseInt((params.workspaceId as string[])[0], 10)
      : parseInt(params.workspaceId as string, 10);

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
      thumbnail: `thumbnail_${lastProjectId + index + 1}.jpg`,
    }));

    return HttpResponse.json(projects);
  }),

  // 특정 프로젝트 조회 핸들러
  http.get('/api/projects/:projectId', ({ params }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt((params.projectId as string[])[0], 10)
      : parseInt(params.projectId as string, 10);

    const response: ProjectResponse = {
      id: projectId,
      title: 'Project Title',
      workspaceId: 1,
      projectType: 'classification',
      createdAt: '2024-09-18T05:04:44.668Z',
      updatedAt: '2024-09-18T05:04:44.668Z',
    };
    return HttpResponse.json(response);
  }),
  // 프로젝트 생성 핸들러
  http.post('/api/workspaces/:workspaceId/projects', async ({ params, request }) => {
    const workspaceId = Array.isArray(params.workspaceId)
      ? parseInt((params.workspaceId as string[])[0], 10)
      : parseInt(params.workspaceId as string, 10);

    // body의 타입을 명시적으로 정의
    const body = (await request.json()) as {
      title: string;
      projectType: 'classification' | 'detection' | 'segmentation';
    };
    const { title, projectType } = body;

    const newProject: ProjectResponse = {
      id: Math.floor(Math.random() * 1000),
      title,
      workspaceId,
      projectType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(newProject);
  }),

  // 프로젝트 수정 핸들러
  http.put('/api/projects/:projectId', async ({ params, request }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt((params.projectId as string[])[0], 10)
      : parseInt(params.projectId as string, 10);

    // body의 타입을 명시적으로 정의
    const body = (await request.json()) as {
      title: string;
      projectType: 'classification' | 'detection' | 'segmentation';
    };
    const { title, projectType } = body;

    const updatedProject: ProjectResponse = {
      id: projectId,
      title,
      workspaceId: 1,
      projectType,
      createdAt: '2024-09-18T05:04:44.668Z',
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(updatedProject);
  }),

  // 프로젝트 삭제 핸들러
  http.delete('/api/projects/:projectId', ({ params }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt((params.projectId as string[])[0], 10)
      : parseInt(params.projectId as string, 10);
    console.log(`Deleted project ${projectId}`);
    return HttpResponse.json({ message: `Project ${projectId} deleted successfully` });
  }),
  // 프로젝트 멤버 조회 핸들러
  http.get('/api/projects/:projectId/members', ({ params }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt((params.projectId as string[])[0], 10)
      : parseInt(params.projectId as string, 10);
    console.log(projectId);

    const members: ProjectMemberResponse[] = [
      {
        memberId: 1,
        nickname: 'adminUser',
        profileImage: 'admin.jpg',
        privilegeType: 'ADMIN',
      },
      {
        memberId: 2,
        nickname: 'managerUser',
        profileImage: 'manager.jpg',
        privilegeType: 'MANAGER',
      },
      {
        memberId: 3,
        nickname: 'editorUser',
        profileImage: 'editor.jpg',
        privilegeType: 'EDITOR',
      },
      {
        memberId: 4,
        nickname: 'viewerUser',
        profileImage: 'viewer.jpg',
        privilegeType: 'VIEWER',
      },
    ];

    return HttpResponse.json(members);
  }),

  // 프로젝트 멤버 추가 핸들러
  http.post('/api/projects/:projectId/members', async ({ params, request }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt((params.projectId as string[])[0], 10)
      : parseInt(params.projectId as string, 10);
    console.log(projectId);

    const newMember = (await request.json()) as {
      nickname: string;
      profileImage: string;
      privilegeType: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';
    };

    const addedMember: ProjectMemberResponse = {
      memberId: Math.floor(Math.random() * 1000), // 임의의 ID 생성
      nickname: newMember.nickname,
      profileImage: newMember.profileImage,
      privilegeType: newMember.privilegeType,
    };

    return HttpResponse.json(addedMember);
  }),

  // 프로젝트 멤버 권한 수정 핸들러
  http.put('/api/projects/:projectId/members', async ({ params, request }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt((params.projectId as string[])[0], 10)
      : parseInt(params.projectId as string, 10);
    console.log(projectId);
    const privilegeData = (await request.json()) as {
      memberId: number;
      privilegeType: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';
    };

    const updatedMember: ProjectMemberResponse = {
      memberId: privilegeData.memberId,
      nickname: 'Updated User',
      profileImage: 'updated.jpg',
      privilegeType: privilegeData.privilegeType,
    };

    return HttpResponse.json(updatedMember);
  }),

  // 프로젝트 멤버 삭제 핸들러
  http.delete('/api/projects/:projectId/members', async ({ params, request }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt((params.projectId as string[])[0], 10)
      : parseInt(params.projectId as string, 10);

    const { targetMemberId } = (await request.json()) as { targetMemberId: number };

    return HttpResponse.json({ message: `Member ${targetMemberId} removed from project ${projectId}` });
  }),

  // 프로젝트 삭제 핸들러
  http.delete('/api/projects/:projectId', ({ params }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt((params.projectId as string[])[0], 10)
      : parseInt(params.projectId as string, 10);
    console.log(`Deleted project ${projectId}`);
    return HttpResponse.json({ message: `Project ${projectId} deleted successfully` });
  }),
];
