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

export interface FolderRequestDTO {
  title: string;
  parentId: number;
}

export interface ChildFolderDTO {
  id: number;
  title: string;
}

export interface FolderResponseDTO {
  id: number;
  title: string;
  images: ImageResponseDTO[];
  children: ChildFolderDTO[];
}

export interface ImageResponseDTO {
  id: number;
  imageTitle: string;
  imageUrl: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'NEED_REVIEW' | 'COMPLETED';
}

export interface ImageMoveRequestDTO {
  moveFolderId: number;
}

export interface ImageStatusChangeRequestDTO {
  labelStatus: 'PENDING' | 'IN_PROGRESS' | 'NEED_REVIEW' | 'COMPLETED';
}

export interface MemberResponseDTO {
  id: number;
  nickname: string;
  profileImage: string;
}

export interface WorkspaceRequestDTO {
  title: string;
  content: string;
}

export interface WorkspaceResponseDTO {
  id: number;
  memberId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceListResponseDTO {
  workspaceResponses: WorkspaceResponseDTO[];
}

export interface SuccessResponse<T> {
  status: number;
  code: number;
  message: string;
  data: T;
  errors: CustomError[];
  isSuccess: boolean;
}
export interface ProjectRequestDTO {
  title: string;
  projectType: 'classification' | 'detection' | 'segmentation';
}
export interface ProjectResponseDTO {
  id: number;
  title: string;
  workspaceId: number;
  projectType: 'classification' | 'detection' | 'segmentation';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectListResponseDTO {
  workspaceResponses: ProjectResponseDTO[];
}

export interface CustomError {
  field: string;
  code: string;
  message: string;
  objectName: string;
}

export interface ErrorResponse {
  status: number;
  code: number;
  message: string;
  data: CustomError;
  errors: CustomError[];
  isSuccess: boolean;
}

export interface BaseResponse<T> {
  status: number;
  code: number;
  message: string;
  data: T;
  errors: CustomError[];
  isSuccess: boolean;
}

export interface RefreshTokenResponseDTO {
  accessToken: string;
}
