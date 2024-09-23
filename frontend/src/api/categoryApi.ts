import api from '@/api/axiosConfig';
import { LabelCategoryRequest, LabelCategoryResponse } from '@/types';

// 레이블 카테고리 리스트 조회
export async function getProjectCategories(projectId: number) {
  return api.get<LabelCategoryResponse[]>(`/projects/${projectId}/categories`).then(({ data }) => data);
}

// 레이블 카테고리 추가
export async function addProjectCategories(projectId: number, categoryData: LabelCategoryRequest) {
  return api.post(`/projects/${projectId}/categories`, categoryData).then(({ data }) => data);
}

// 레이블 카테고리 단일 조회
export async function getCategoryById(projectId: number, categoryId: number) {
  return api.get<LabelCategoryResponse>(`/projects/${projectId}/categories/${categoryId}`).then(({ data }) => data);
}

// 레이블 카테고리 삭제
export async function deleteCategory(projectId: number, categoryId: number) {
  return api.delete(`/projects/${projectId}/categories/${categoryId}`).then(({ data }) => data);
}

// 레이블 카테고리 존재 여부 조회
export async function checkCategoryExists(projectId: number, categoryName: string) {
  return api
    .get<boolean>(`/projects/${projectId}/categories/exist`, {
      params: { categoryName },
    })
    .then(({ data }) => data);
}
