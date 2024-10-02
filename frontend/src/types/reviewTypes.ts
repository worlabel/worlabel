import { ImageStatus } from './imageTypes';
import { MemberResponse } from './memberTypes';

export type ReviewStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED';

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
  status: ReviewStatus;
  author: MemberResponse;
  createAt: string;
  updateAt: string;
}

export interface ReviewStatusRequest {
  reviewStatus: ReviewStatus;
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
  reviewStatus: ReviewStatus;
  images: ReviewImageResponse[];
  createdAt: string;
  updatedAt: string;
  author: MemberResponse;
  reviewer: MemberResponse;
}
