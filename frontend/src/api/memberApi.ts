import api from '@/api/axiosConfig';
import { MemberResponse } from '@/types';

export async function searchMembersByEmail(keyword: string) {
  return api
    .get<MemberResponse[]>(`/members`, {
      params: { keyword },
      withCredentials: true,
    })
    .then(({ data }) => data);
}
