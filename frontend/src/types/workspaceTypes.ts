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
