import api from '@/api/axiosConfig';

export async function reissueToken() {
  return api.post('/auth/reissue', null, { withCredentials: true });
}

export async function fetchProfile() {
  return api.get('/auth/profile', {
    withCredentials: true,
  });
}
