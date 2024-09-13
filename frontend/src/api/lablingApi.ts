import api from '@/api/axiosConfig';
import { LabelingRequestDTO } from '@/types';

export async function saveImageLabels(projectId: number, imageId: number, memberId: number, data: LabelingRequestDTO) {
  return api.post(`/projects/${projectId}/label/image/${imageId}`, data, {
    params: { memberId },
  });
}

export async function runAutoLabel(projectId: number, memberId: number) {
  return api.post(
    `/projects/${projectId}/label/auto`,
    {},
    {
      params: { memberId },
    }
  );
}
