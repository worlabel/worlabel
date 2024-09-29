import { ImageStatus } from './imageTypes';
import { MemberResponse } from './memberTypes';

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
