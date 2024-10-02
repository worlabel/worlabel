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

// 이미지 상세 조회 응답 DTO
export interface ImageDetailResponse {
  id: number;
  imageTitle: string;
  imageUrl: string;
  data: string | null;
  status: ImageStatus;
}
export interface ImageFolderRequest {
  memberId: number;
  projectId: number;
  parentId: number;
  files: File[];
}

export interface ImagePresignedUrlResponse{
  id: number;
  presignedUrl: string;
}