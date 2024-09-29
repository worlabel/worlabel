import { MemberResponse } from './memberTypes';

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
