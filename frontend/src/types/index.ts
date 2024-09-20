// 파일 및 디렉터리 관련 타입
export type FileItem = {
  id: number;
  name: string;
  url: string;
  type: 'image' | 'json';
  status: 'idle' | 'done';
};

export type DirectoryItem = {
  id: number;
  name: string;
  type: 'directory';
  children: Array<DirectoryItem | FileItem>;
};

// 프로젝트 관련 타입
export type Project = {
  id: number;
  name: string;
  type: 'classification' | 'detection' | 'segmentation';
  children: Array<DirectoryItem | FileItem>;
};

// 워크스페이스 관련 타입
export type Workspace = {
  id: number;
  name: string;
  projects: Array<Project>;
};

// 레이블 관련 타입
export type Label = {
  id: number;
  name: string;
  color: string;
  type: 'polygon' | 'rect';
  coordinates: Array<[number, number]>;
};

export interface LabelingRequest {
  memberId: number;
  projectId: number;
  imageId: number;
}

export interface AutoLabelingResponse {
  imageId: number;
  imageUrl: string;
  data: string;
}

// 폴더 및 이미지 관련 DTO
export interface FolderRequest {
  title: string;
  parentId: number;
}

export interface ChildFolder {
  id: number;
  title: string;
}

export interface FolderResponse {
  id: number;
  title: string;
  images: ImageResponse[];
  children: ChildFolder[];
}

export interface ImageResponse {
  id: number;
  imageTitle: string;
  imagePath: string;
  dataPath: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SAVE' | 'REVIEW_REQUEST' | 'COMPLETED';
}

// 이미지 이동 및 상태변경 요청 DTO
export interface ImageMoveRequest {
  moveFolderId: number;
}

export interface ImageStatusChangeRequest {
  labelStatus: 'PENDING' | 'IN_PROGRESS' | 'SAVE' | 'REVIEW_REQUEST' | 'COMPLETED';
}

// 멤버 관련 DTO
export interface MemberResponse {
  id: number;
  nickname: string;
  profileImage: string;
  email: string;
}

// 워크스페이스 관련 DTO
export interface WorkspaceMemberResponse {
  id: number;
  nickname: string;
  profileImage: string;
}
export interface WorkspaceRequest {
  title: string;
  content: string;
}

export interface WorkspaceResponse {
  id: number;
  memberId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceListResponse {
  workspaceResponses: WorkspaceResponse[];
}

export interface ProjectRequest {
  title: string;
  projectType: 'classification' | 'detection' | 'segmentation';
}

export interface ProjectResponse {
  id: number;
  title: string;
  workspaceId: number;
  projectType: 'classification' | 'detection' | 'segmentation';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectListResponse {
  workspaceResponses: ProjectResponse[];
}

// 댓글 관련 DTO
export interface CommentRequest {
  content: string;
  positionX: number;
  positionY: number;
}

export interface CommentResponse {
  id: number;
  memberId: number;
  memberNickname: string;
  memberProfileImage: string;
  positionX: number;
  positionY: number;
  content: string;
  createTime: string; // 작성 일자 (ISO 8601 형식)
  author: MemberResponse; // 추가됨
}

export interface CommentListResponse {
  commentResponses: CommentResponse[];
}

// 프로젝트 멤버 관련 DTO
export interface ProjectMemberRequest {
  memberId: number;
  privilegeType: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';
}

export interface ProjectMemberResponse {
  memberId: number;
  nickname: string;
  profileImage: string;
  privilegeType: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';
}

// 리뷰 관련 DTO
export interface ReviewRequest {
  title: string;
  content: string;
  imageIds: number[];
}

export interface ReviewResponse {
  reviewId: number;
  projectId: number;
  title: string;
  content: string;
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED';
  author: MemberResponse;
  createAt: string;
  updateAt: string;
}

export interface ReviewStatusRequest {
  reviewStatus: 'REQUESTED' | 'APPROVED' | 'REJECTED';
}

export interface ReviewImageResponse {
  id: number;
  imageTitle: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SAVE' | 'REVIEW_REQUEST' | 'COMPLETED';
  imagePath: string;
  dataPath: string;
}

export interface ReviewDetailResponse {
  reviewId: number;
  title: string;
  content: string;
  reviewStatus: 'REQUESTED' | 'APPROVED' | 'REJECTED';
  images: ReviewImageResponse[];
  createAt: string;
  updateAt: string;
  author: MemberResponse;
  reviewer: MemberResponse;
}

// 카테고리 관련 DTO
export interface CategoryRequest {
  categoryName: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
}

// 레이블 저장 요청 DTO
export interface LabelSaveRequest {
  data: string;
}

// 폴더 ID 응답 DTO
export interface FolderIdResponse {
  id: number;
  title: string;
}

// 이미지 상세 조회 응답 DTO
export interface ImageDetailResponse {
  id: number;
  imageTitle: string;
  imageUrl: string;
  data: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'SAVE' | 'REVIEW_REQUEST' | 'COMPLETED';
}

// 리프레시 토큰 응답 DTO
export interface RefreshTokenResponse {
  accessToken: string;
}

export interface Shape {
  label: string;
  color: string;
  points: [number, number][];
  group_id: number;
  shape_type: 'polygon' | 'rectangle';
  flags: Record<string, never>;
}

export interface LabelJson {
  version: string;
  task_type: 'det' | 'seg';
  shapes: Shape[];
  split: string;
  imageHeight: number;
  imageWidth: number;
  imageDepth: number;
}
