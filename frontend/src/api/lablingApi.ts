import api from '@/api/axiosConfig';

export async function saveImageLabels(
  projectId: number,
  imageId: number,
  data: {
    data: string;
  }
) {
  return api.post(`/projects/${projectId}/label/image/${imageId}`, data).then(({ data }) => data);
}

export async function runAutoLabel(projectId: number, memberId: number) {
  return api
    .post(
      `/projects/${projectId}/label/auto`,
      {},
      {
        params: { memberId },
      }
    )
    .then(({ data }) => data);
}
