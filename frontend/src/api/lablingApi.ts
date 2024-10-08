import api from '@/api/axiosConfig';

export async function saveImageLabels(
  projectId: number,
  imageId: number,
  data: {
    data: string;
  }
) {
  return api.post(`/projects/${projectId}/images/${imageId}/label`, data).then(({ data }) => data);
}

export async function runAutoLabel(projectId: number, modelId = 1) {
  return api.post(`/projects/${projectId}/auto`, { modelId }, { timeout: 0 }).then(({ data }) => data);
}
