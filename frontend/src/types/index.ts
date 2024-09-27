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
  categoryId: number;
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

export type ImageStatus = 'PENDING' | 'IN_PROGRESS' | 'SAVE' | 'REVIEW_REQUEST' | 'REVIEW_REJECTED' | 'COMPLETED';

export interface ImageResponse {
  id: number;
  imageTitle: string;
  imagePath: string;
  dataPath: string;
  status: ImageStatus;
}

// 이미지 이동 및 상태변경 요청 DTO
export interface ImageMoveRequest {
  moveFolderId: number;
}

export interface ImageStatusChangeRequest {
  labelStatus: ImageStatus;
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
  categories: string[];
}

export type ProjectResponse = {
  id: number;
  title: string;
  workspaceId: number;
  projectType: 'classification' | 'detection' | 'segmentation';
  createdAt: string;
  updatedAt: string;
  thumbnail?: string; // Optional
};

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
  status: ImageStatus;
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
  status: ImageStatus;
}

// 리프레시 토큰 응답 DTO
export interface RefreshTokenResponse {
  accessToken: string;
}

export interface Shape {
  categoryId: number;
  color: string;
  points: [number, number][];
  group_id: number;
  shape_type: 'polygon' | 'rectangle';
  flags: Record<string, never>;
}

export interface LabelJson {
  version: string;
  task_type: 'cls' | 'det' | 'seg';
  shapes: Shape[];
  split: string;
  imageHeight: number;
  imageWidth: number;
  imageDepth: number;
}

export interface ErrorResponse {
  status: number;
  code: number;
  message: string;
  isSuccess: boolean;
}

export interface ImageFolderRequest {
  memberId: number;
  projectId: number;
  parentId: number;
  files: File[];
}
export interface LabelCategoryResponse {
  id: number;
  labelName: string;
}
// 카테고리 요청 DTO
export interface LabelCategoryRequest {
  labelCategoryList: number[];
}

// 모델 카테고리 응답 DTO
export interface ModelCategoryResponse {
  id: number;
  name: string;
}

// 모델 요청 DTO (API로 전달할 데이터 타입)
export interface ModelRequest {
  name: string;
}

// 모델 응답 DTO (API로부터 받는 데이터 타입)
export interface ModelResponse {
  id: number;
  name: string;
  isDefault: boolean;
  isTrain: boolean;
}

// 프로젝트 모델 리스트 응답 DTO
export interface ProjectModelsResponse extends Array<ModelResponse> {}
// 모델 훈련 요청 DTO
export interface ModelTrainRequest {
  modelId: number;
  ratio: number;
  epochs: number;
  batch: number;
  lr0: number;
  lrf: number;
  optimizer: 'AUTO' | 'SGD' | 'ADAM' | 'ADAMW' | 'NADAM' | 'RADAM' | 'RMSPROP';
}
export interface ResultResponse {
  id: number;
  precision: number;
  recall: number;
  fitness: number;
  ratio: number;
  epochs: number;
  batch: number;
  lr0: number;
  lrf: number;
  optimizer: 'AUTO' | 'SGD' | 'ADAM' | 'ADAMW' | 'NADAM' | 'RADAM' | 'RMSPROP';
  map50: number;
  map5095: number;
}

export interface ReportResponse {
  modelId: number;
  totalEpochs: number;
  epoch: number;
  boxLoss: number;
  clsLoss: number;
  dflLoss: number;
  fitness: number;
  epochTime: number;
  leftSecond: number;
}
