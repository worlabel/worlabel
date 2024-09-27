import api from '@/api/axiosConfig';
import { ModelRequest, ModelResponse, ProjectModelsResponse, ModelCategoryResponse, ModelTrainRequest } from '@/types';

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
