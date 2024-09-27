import api from '@/api/axiosConfig';
import { ReportResponse } from '@/types';

export async function getCompletedModelReport(projectId: number, modelId: number) {
  return api.get<ReportResponse[]>(`/projects/${projectId}/reports/models/${modelId}`).then(({ data }) => data);
}

export async function getTrainingModelReport(projectId: number, modelId: number) {
  return api
    .get<ReportResponse[]>(`/projects/${projectId}/reports/models/${modelId}/progress`)
    .then(({ data }) => data);
}
