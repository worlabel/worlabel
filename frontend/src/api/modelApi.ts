import api from '@/api/axiosConfig';
import {
  ModelRequest,
  ModelResponse,
  ProjectModelsResponse,
  ModelCategoryResponse,
  ModelTrainRequest,
  ResultResponse,
  ReportResponse,
} from '@/types';

export async function updateModelName(projectId: number, modelId: number, modelData: ModelRequest) {
  return api.put<ModelResponse>(`/projects/${projectId}/models/${modelId}`, modelData).then(({ data }) => data);
}

export async function trainModel(projectId: number, trainData: ModelTrainRequest) {
  return api.post(`/projects/${projectId}/train`, trainData).then(({ data }) => data);
}

export async function getProjectModels(projectId: number) {
  return api.get<ProjectModelsResponse>(`/projects/${projectId}/models`).then(({ data }) => data);
}

export async function addProjectModel(projectId: number, modelData: ModelRequest) {
  return api.post<ModelResponse>(`/projects/${projectId}/models`, modelData).then(({ data }) => data);
}

export async function getModelCategories(modelId: number) {
  return api.get<ModelCategoryResponse[]>(`/models/${modelId}/categories`).then(({ data }) => data);
}

export async function getModelResults(modelId: number) {
  return api.get<ResultResponse[]>(`/results/model/${modelId}`).then(({ data }) => data);
}

export async function getModelReports(projectId: number, modelId: number) {
  return api.get<ReportResponse[]>(`/projects/${projectId}/reports/model/${modelId}`).then(({ data }) => data);
}
