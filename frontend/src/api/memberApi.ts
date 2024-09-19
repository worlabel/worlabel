import api from '@/api/axiosConfig';
import { MemberSearchResponse } from '@/types';

export async function searchMembersByEmail(keyword: string) {
  return api
    .get<MemberSearchResponse[]>(`/api/members`, {
      params: { keyword },
      withCredentials: true,
    })
    .then(({ data }) => data);
}
