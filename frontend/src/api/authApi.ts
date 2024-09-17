import api from '@/api/axiosConfig';
import { MemberResponse, RefreshTokenResponse } from '@/types';

export async function reissueToken() {
  return api.post<RefreshTokenResponse>('/auth/reissue', null, { withCredentials: true }).then(({ data }) => data);
}

export async function getProfile() {
  return api
    .get<MemberResponse>('/auth/profile', {
      withCredentials: true,
    })
    .then(({ data }) => data);
}
