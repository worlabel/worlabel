import api from '@/api/axiosConfig';
import { ModelRequest, ModelResponse, ProjectModelsResponse, ModelCategoryResponse } from '@/types';

export async function updateModelName(projectId: number, modelId: number, modelData: ModelRequest) {
  return api.put<ModelResponse>(`/api/projects/${projectId}/models/${modelId}`, modelData).then(({ data }) => data);
}

export async function trainModel(projectId: number) {
  return api.post(`/api/projects/${projectId}/train`).then(({ data }) => data);
}

export async function getProjectModels(projectId: number) {
  return api.get<ProjectModelsResponse>(`/api/projects/${projectId}/models`).then(({ data }) => data);
}

export async function addProjectModel(projectId: number, modelData: ModelRequest) {
  return api.post<ModelResponse>(`/api/projects/${projectId}/models`, modelData).then(({ data }) => data);
}

export async function getModelCategories(modelId: number) {
  return api.get<ModelCategoryResponse[]>(`/api/models/${modelId}/categories`).then(({ data }) => data);
}
