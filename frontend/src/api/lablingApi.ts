import api from '@/api/axiosConfig';
import { LabelingRequest } from '@/types';

export async function saveImageLabels(projectId: number, imageId: number, memberId: number, data: LabelingRequest) {
  return api
    .post(`/projects/${projectId}/label/image/${imageId}`, data, {
      params: { memberId },
    })
    .then(({ data }) => data);
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
