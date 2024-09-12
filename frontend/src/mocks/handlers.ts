import { http, HttpResponse } from 'msw';
import {
  BaseResponse,
  ProjectResponseDTO,
  FolderResponseDTO,
  ImageResponseDTO,
  WorkspaceResponseDTO,
  MemberResponseDTO,
  RefreshTokenResponseDTO,
  AutoLabelingResponseDTO,
  ProjectListResponseDTO,
} from '@/types';

export const handlers = [
  // Auth Handlers
  http.post('/api/auth/reissue', () => {
    // 토큰 재발급 핸들러
    const response: BaseResponse<RefreshTokenResponseDTO> = {
      status: 200,
      code: 0,
      message: '토큰 재발급 성공',
      data: { accessToken: 'newAccessToken' },
      errors: [],
      isSuccess: true,
    };
    return HttpResponse.json(response);
  }),

  http.get('/api/auth/profile', () => {
    // 사용자 프로필 핸들러
    const response: BaseResponse<MemberResponseDTO> = {
      status: 200,
      code: 0,
      message: '사용자 정보 가져오기 성공',
      data: {
        id: 1,
        nickname: 'javajoha',
        profileImage: 'profile.jpg',
      },
      errors: [],
      isSuccess: true,
    };
    return HttpResponse.json(response);
  }),

  // Workspace Handlers
  http.get('/api/workspaces/:workspaceId', ({ params }) => {
    // 워크스페이스 조회 핸들러
    const { workspaceId } = params;
    const response: BaseResponse<WorkspaceResponseDTO> = {
      status: 200,
      code: 0,
      message: '워크스페이스 조회 성공',
      data: {
        id: parseInt(workspaceId as string, 10),
        memberId: '1',
        title: 'Workspace Title',
        content: 'Workspace Content',
        createdAt: '2024-09-12T00:00:00Z',
        updatedAt: '2024-09-12T00:00:00Z',
      },
      errors: [],
      isSuccess: true,
    };
    return HttpResponse.json(response);
  }),

  http.put('/api/workspaces/:workspaceId', ({ params }) => {
    // 워크스페이스 수정 핸들러
    const { workspaceId } = params;
    const response: BaseResponse<WorkspaceResponseDTO> = {
      status: 200,
      code: 0,
      message: '워크스페이스 수정 성공',
      data: {
        id: parseInt(workspaceId as string, 10),
        memberId: '1',
        title: 'Updated Workspace Title',
        content: 'Updated Workspace Content',
        createdAt: '2024-09-12T00:00:00Z',
        updatedAt: '2024-09-12T01:00:00Z',
      },
      errors: [],
      isSuccess: true,
    };
    return HttpResponse.json(response);
  }),

  http.delete('/api/workspaces/:workspaceId', ({ params }) => {
    const { workspaceId } = params;
    console.log(workspaceId);
    const response: BaseResponse<null> = {
      status: 200,
      code: 0,
      message: '워크스페이스 삭제 성공',
      data: null,
      errors: [],
      isSuccess: true,
    };
    return HttpResponse.json(response);
  }),

  http.get('/api/workspaces', () => {
    // 워크스페이스 목록 조회 핸들러
    const response: BaseResponse<{ workspaceResponses: WorkspaceResponseDTO[] }> = {
      status: 200,
      code: 0,
      message: '워크스페이스 목록 조회 성공',
      data: {
        workspaceResponses: [
          {
            id: 1,
            memberId: '1',
            title: 'Workspace 1',
            content: 'Content 1',
            createdAt: '2024-09-12T00:00:00Z',
            updatedAt: '2024-09-12T00:00:00Z',
          },
        ],
      },
      errors: [],
      isSuccess: true,
    };
    return HttpResponse.json(response);
  }),

  // Project Handlers
  http.get('/api/projects/:projectId', ({ params }) => {
    // 프로젝트 조회 핸들러
    const { projectId } = params;
    const response: BaseResponse<ProjectResponseDTO> = {
      status: 200,
      code: 0,
      message: '프로젝트 조회 성공',
      data: {
        id: parseInt(projectId as string, 10),
        title: 'Project Title',
        workspaceId: 1,
        projectType: 'classification',
        createdAt: '2024-09-12T00:00:00Z',
        updatedAt: '2024-09-12T00:00:00Z',
      },
      errors: [],
      isSuccess: true,
    };
    return HttpResponse.json(response);
  }),

  http.post('/api/workspaces/:workspaceId/projects', () => {
    // 프로젝트 생성 핸들러
    const response: BaseResponse<ProjectResponseDTO> = {
      status: 200,
      code: 0,
      message: '프로젝트 생성 성공',
      data: {
        id: 3,
        title: 'New Project',
        workspaceId: 1,
        projectType: 'detection',
        createdAt: '2024-09-12T01:00:00Z',
        updatedAt: '2024-09-12T01:00:00Z',
      },
      errors: [],
      isSuccess: true,
    };
    return HttpResponse.json(response);
  }),

  http.put('/api/projects/:projectId', ({ params }) => {
    // 프로젝트 수정 핸들러
    const { projectId } = params;
    const response: BaseResponse<ProjectResponseDTO> = {
      status: 200,
      code: 0,
      message: '프로젝트 수정 성공',
      data: {
        id: parseInt(projectId as string, 10),
        title: 'Updated Project Title',
        workspaceId: 1,
        projectType: 'segmentation',
        createdAt: '2024-09-12T00:00:00Z',
        updatedAt: '2024-09-12T01:00:00Z',
      },
      errors: [],
      isSuccess: true,
    };
    return HttpResponse.json(response);
  }),

  http.delete('/api/projects/:projectId', ({ params }) => {
    const { projectId } = params;
    console.log(projectId);

    const response: BaseResponse<null> = {
      status: 200,
      code: 0,
      message: '프로젝트 삭제 성공',
      data: null,
      errors: [],
      isSuccess: true,
    };
    return HttpResponse.json(response);
  }),

  http.get('/api/projects/:projectId/folders/:folderId', ({ params }) => {
    const { folderId } = params;
    const response: BaseResponse<FolderResponseDTO> = {
      status: 200,
      code: 0,
      message: '폴더 조회 성공',
      data: {
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
      },
      errors: [
        {
          field: 'id',
          code: '1001',
          message: 'ID format issue',
          objectName: 'FolderResponseDTO',
        },
      ],
      isSuccess: true,
    };
    return HttpResponse.json(response);
  }),

  http.get('/api/workspaces/:workspaceId/projects', ({ request, params }) => {
    // request.params로 workspaceId 가져오기
    const workspaceIdParam = params.workspaceId;
    const workspaceId = parseInt(Array.isArray(workspaceIdParam) ? workspaceIdParam[0] : workspaceIdParam, 10);

    // URL 인스턴스를 통해 요청 URL을 다룹니다.
    const url = new URL(request.url);
    // const memberId = parseInt(url.searchParams.get('memberId') || '0', 10);
    const lastProjectId = parseInt(url.searchParams.get('lastProjectId') || '0', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    // 프로젝트 데이터 예시 생성
    const projects: ProjectResponseDTO[] = Array.from({ length: limit }, (_, index) => ({
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
    const response: BaseResponse<ProjectListResponseDTO> = {
      status: 200,
      code: 0,
      message: '프로젝트 목록 조회 성공',
      data: {
        workspaceResponses: projects,
      },
      errors: [],
      isSuccess: true,
    };

    return HttpResponse.json(response);
  }),

  http.post('/api/projects/:projectId/folders', () => {
    // 폴더 생성 핸들러
    const response: BaseResponse<FolderResponseDTO> = {
      status: 200,
      code: 0,
      message: '폴더 생성 성공',
      data: {
        id: 2,
        title: 'New Folder',
        images: [],
        children: [],
      },
      errors: [],
      isSuccess: true,
    };
    return HttpResponse.json(response);
  }),

  // Image Handlers
  http.get('/api/projects/:projectId/folders/:folderId/images/:imageId', ({ params }) => {
    // 이미지 조회 핸들러
    const { imageId } = params;
    const response: BaseResponse<ImageResponseDTO> = {
      status: 200,
      code: 0,
      message: '이미지 조회 성공',
      data: {
        id: parseInt(imageId as string, 10),
        imageTitle: 'Image Title',
        imageUrl: 'image-url.jpg',
        status: 'PENDING',
      },
      errors: [],
      isSuccess: true,
    };
    return HttpResponse.json(response);
  }),

  http.put('/api/projects/:projectId/folders/:folderId/images/:imageId', () => {
    // 이미지 이동 핸들러
    const response: BaseResponse<null> = {
      status: 200,
      code: 0,
      message: '이미지 이동 성공',
      data: null,
      errors: [],
      isSuccess: true,
    };
    return HttpResponse.json(response);
  }),

  // Labeling Handlers
  http.post('/api/projects/:projectId/label/image/:imageId', () => {
    // 이미지 단위 레이블링 핸들러
    const response: BaseResponse<Record<string, never>> = {
      status: 200,
      code: 0,
      message: '이미지 레이블링 저장 성공',
      data: {},
      errors: [],
      isSuccess: true,
    };
    return HttpResponse.json(response);
  }),

  // 오토 레이블링 핸들러
  http.post('/api/projects/:projectId/label/auto', ({ params }) => {
    const { projectId } = params;
    console.log(projectId);

    // 오토 레이블링 결과를 문자열로 준비 (예시: Classification)
    const classificationData = `{
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
      }`;

    // // 오토 레이블링 결과를 문자열로 준비 (예시: Detection)
    // const detectionData = `{
    //     "version": "0.1.0",
    //     "task_type": "det",
    //     "shapes": [
    //       {
    //         "label": "NG",
    //         "color": "#FF0000",
    //         "points": [[0, 0], [200, 200]],
    //         "group_id": null,
    //         "shape_type": "rectangle",
    //         "flags": {}
    //       },
    //       {
    //         "label": "NG",
    //         "color": "#FF0000",
    //         "points": [[0, 0], [200, 200]],
    //         "group_id": null,
    //         "shape_type": "rectangle",
    //         "flags": {}
    //       }
    //     ],
    //     "split": "none",
    //     "imageHeight": 2000,
    //     "imageWidth": 4000,
    //     "imageDepth": 4
    //   }`;

    // // 오토 레이블링 결과를 문자열로 준비 (예시: Segmentation)
    // const segmentationData = `{
    //     "version": "0.1.0",
    //     "task_type": "seg",
    //     "shapes": [
    //       {
    //         "label": "NG",
    //         "color": "#FF0000",
    //         "points": [[0, 0], [200, 200]],
    //         "group_id": null,
    //         "shape_type": "linestrip",
    //         "flags": {}
    //       },
    //       {
    //         "label": "NG",
    //         "color": "#FF0000",
    //         "points": [[0, 0], [200, 200]],
    //         "group_id": null,
    //         "shape_type": "polygon",
    //         "flags": {}
    //       }
    //     ],
    //     "split": "none",
    //     "imageHeight": 2000,
    //     "imageWidth": 4000,
    //     "imageDepth": 4
    //   }`;

    // AutoLabelingResponseDTO 예시
    const response: BaseResponse<AutoLabelingResponseDTO> = {
      status: 200,
      code: 0,
      message: '프로젝트 오토 레이블링 성공',
      data: {
        imageId: 1,
        imageUrl: 'image-url.jpg',
        data: classificationData,
      },
      errors: [],
      isSuccess: true,
    };

    return HttpResponse.json(response);
  }),
];
