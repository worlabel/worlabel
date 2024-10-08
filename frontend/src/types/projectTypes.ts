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
