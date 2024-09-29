// 멤버 관련 DTO
export interface MemberResponse {
  id: number;
  nickname: string;
  profileImage: string;
  email: string;
}
// 리프레시 토큰 응답 DTO
export interface RefreshTokenResponse {
  accessToken: string;
}
