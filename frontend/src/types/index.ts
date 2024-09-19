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

export type Project = {
  id: number;
  name: string;
  type: 'Classification' | 'Detection' | 'Segmentation';
  children: Array<DirectoryItem | FileItem>;
};

export type Workspace = {
  id: number;
  name: string;
  projects: Array<Project>;
};

export type Label = {
  id: number;
  name: string;
  color: string;
  type: 'polygon' | 'rect';
  coordinates: Array<[number, number]>;
};
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
  imageUrl: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SAVE' | 'REVIEW_REQUEST' | 'COMPLETED';
}

export interface ImageMoveRequest {
  moveFolderId: number;
}

export interface ImageStatusChangeRequest {
  labelStatus: 'PENDING' | 'IN_PROGRESS' | 'SAVE' | 'REVIEW_REQUEST' | 'COMPLETED';
}

export interface MemberResponse {
  id: number;
  nickname: string;
  profileImage: string;
}
export interface MemberSearchResponse {
  id: number;
  nickname: string;
  profileImage: string;
  email: string;
}
export interface WorkspaceMemberResponse {
  memberId: number;
  nickname: string;
  profileImage: string;
}

export interface WorkspaceRequest {
  title: string;
  content: string;
}

export interface WorkspaceResponse {
  id: number;
  memberId: number;
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

export interface RefreshTokenResponse {
  accessToken: string;
}

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
}

export interface CommentListResponse {
  commentResponses: CommentResponse[];
}

export interface ProjectMemberRequest {
  memberId: number;
  privilegeType: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';
}

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

// 리뷰 요청 DTO
export interface ReviewRequest {
  title: string;
  content: string;
  imageIds: number[];
}

// 리뷰 응답 DTO
export interface ReviewResponse {
  reviewId: number;
  projectId: number;
  title: string;
  content: string;
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED';
  nickname: string;
  email: string;
  createAt: string;
  updateAt: string;
}

// 리뷰 상태 요청 DTO
export interface ReviewStatusRequest {
  reviewStatus: 'REQUESTED' | 'APPROVED' | 'REJECTED';
}

// 리뷰 이미지 응답 DTO
export interface ReviewImageResponse {
  id: number;
  imageTitle: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SAVE' | 'REVIEW_REQUEST' | 'COMPLETED';
  imagePath: string;
  dataPath: string;
}

// 리뷰 디테일 응답 DTO
export interface ReviewDetailResponse {
  reviewId: number;
  title: string;
  content: string;
  reviewStatus: 'REQUESTED' | 'APPROVED' | 'REJECTED';
  images: ReviewImageResponse[];
  createAt: string;
  updateAt: string;
  email: string;
  profileImage: string;
  nickname: string;
  reviewerEmail: string;
  reviewerProfileImage: string;
  reviewerNickname: string;
}
// 프로젝트 멤버 응답 DTO
export interface ProjectMemberResponse {
  memberId: number;
  nickname: string;
  profileImage: string;
  privilegeType: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';
}
export interface FolderIdResponse {
  id: number;
  title: string;
}

export interface ImageDetailResponse {
  id: number;
  imageTitle: string;
  imageUrl: string;
  data: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'SAVE' | 'REVIEW_REQUEST' | 'COMPLETED';
}

export interface CategoryRequest {
  categoryName: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
}

export interface LabelSaveRequest {
  data: string;
}

export interface ProjectMemberResponse {
  memberId: number;
  nickname: string;
  profileImage: string;
  privilegeType: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';
}

export interface ProjectMemberRequest {
  memberId: number;
  privilegeType: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';
}

export interface ErrorResponse {
  status: number;
  code: number;
  message: string;
  isSuccess: boolean;
}
