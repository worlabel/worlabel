import { http, HttpResponse } from 'msw';
import { RefreshTokenResponse, MemberResponse } from '@/types';

export const authHandlers = [
  http.post('/api/auth/reissue', () => {
    const response: RefreshTokenResponse = { accessToken: 'newAccessToken' };
    return HttpResponse.json(response);
  }),

  http.get('/api/auth/profile', () => {
    const response: MemberResponse = {
      id: 1,
      nickname: 'javajoha',
      profileImage: 'profile.jpg',
      email: 'j9@naver.com',
    };
    return HttpResponse.json(response);
  }),
];
