import { http, HttpResponse } from 'msw';
import { LabelCategoryRequest, LabelCategoryResponse } from '@/types';

export const categoryHandlers = [
  // 레이블 카테고리 리스트 조회 핸들러
  http.get('/api/projects/:projectId/categories', ({ params }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10);
    console.log(projectId);
    const categories: LabelCategoryResponse[] = [
      { id: 1, labelName: 'Category 1' },
      { id: 2, labelName: 'Category 2' },
    ];

    return HttpResponse.json(categories);
  }),

  // 레이블 카테고리 추가 핸들러
  http.post('/api/projects/:projectId/categories', async ({ params, request }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10);

    const categoryData = (await request.json()) as LabelCategoryRequest;
    console.log(categoryData);

    const newCategory: LabelCategoryResponse = {
      id: Math.floor(Math.random() * 1000), // 임의로 ID 생성
      labelName: `New Category for project ${projectId}`,
    };

    return HttpResponse.json(newCategory);
  }),

  // 레이블 카테고리 단일 조회 핸들러
  http.get('/api/projects/:projectId/categories/:categoryId', ({ params }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10);
    const categoryId = Array.isArray(params.categoryId)
      ? parseInt(params.categoryId[0], 10)
      : parseInt(params.categoryId as string, 10);
    console.log(projectId);
    const category: LabelCategoryResponse = {
      id: categoryId,
      labelName: `Category ${categoryId}`,
    };

    return HttpResponse.json(category);
  }),

  // 레이블 카테고리 삭제 핸들러
  http.delete('/api/projects/:projectId/categories/:categoryId', ({ params }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10);
    const categoryId = Array.isArray(params.categoryId)
      ? parseInt(params.categoryId[0], 10)
      : parseInt(params.categoryId as string, 10);

    return HttpResponse.json({ message: `Category ${categoryId} deleted from project ${projectId}` });
  }),

  // 레이블 카테고리 존재 여부 조회 핸들러
  http.get('/api/projects/:projectId/categories/exist', ({ params }) => {
    const projectId = Array.isArray(params.projectId)
      ? parseInt(params.projectId[0], 10)
      : parseInt(params.projectId as string, 10);
    console.log(projectId);
    const categoryName = Array.isArray(params.categoryName) ? params.categoryName[0] : params.categoryName;

    const exists = categoryName === 'Category 1'; // 임의로 'Category 1'만 존재하는 것으로 설정

    return HttpResponse.json(exists);
  }),
];
