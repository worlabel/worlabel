// import { http, HttpResponse } from 'msw';
// import {
//   ModelRequest,
//   ModelResponse,
//   ProjectModelsResponse,
//   ModelCategoryResponse,
//   ModelTrainRequest,
//   ResultResponse,
//   ReportResponse,
// } from '@/types';

// export const modelHandlers = [
//   // 모델 이름 업데이트 핸들러
//   http.put('/api/projects/:projectId/models/:modelId', async ({ params, request }) => {
//     const projectId = Array.isArray(params.projectId)
//       ? parseInt(params.projectId[0], 10)
//       : parseInt(params.projectId as string, 10);
//     const modelId = Array.isArray(params.modelId)
//       ? parseInt(params.modelId[0], 10)
//       : parseInt(params.modelId as string, 10);
//     console.log(projectId);
//     const modelData = (await request.json()) as ModelRequest;

//     const updatedModel: ModelResponse = {
//       id: modelId,
//       name: modelData.name,
//       isDefault: false,
//     };

//     return HttpResponse.json(updatedModel);
//   }),

//   // 모델 학습 핸들러
//   http.post('/api/projects/:projectId/train', async ({ params, request }) => {
//     const projectId = Array.isArray(params.projectId)
//       ? parseInt(params.projectId[0], 10)
//       : parseInt(params.projectId as string, 10);

//     const trainData = (await request.json()) as ModelTrainRequest;

//     return HttpResponse.json({
//       message: `Model training started for project ${projectId}`,
//       trainData,
//     });
//   }),

//   // 프로젝트의 모델 리스트 조회 핸들러
//   http.get('/api/projects/:projectId/models', ({ params }) => {
//     const projectId = Array.isArray(params.projectId)
//       ? parseInt(params.projectId[0], 10)
//       : parseInt(params.projectId as string, 10);
//     console.log(projectId);

//     const models: ProjectModelsResponse = [
//       { id: 1, name: 'Model 1', isDefault: true },
//       { id: 2, name: 'Model 2', isDefault: false },
//     ];

//     return HttpResponse.json(models);
//   }),

//   // 모델 추가 핸들러
//   http.post('/api/projects/:projectId/models', async ({ params, request }) => {
//     const projectId = Array.isArray(params.projectId)
//       ? parseInt(params.projectId[0], 10)
//       : parseInt(params.projectId as string, 10);

//     const modelData = (await request.json()) as ModelRequest;
//     console.log(projectId);

//     const newModel: ModelResponse = {
//       id: Math.floor(Math.random() * 1000), // 임의로 ID 생성
//       name: modelData.name,
//       isDefault: false,
//     };

//     return HttpResponse.json(newModel);
//   }),

//   // 모델 카테고리 조회 핸들러
//   http.get('/api/models/:modelId/categories', ({ params }) => {
//     const modelId = Array.isArray(params.modelId)
//       ? parseInt(params.modelId[0], 10)
//       : parseInt(params.modelId as string, 10);
//     console.log(modelId);
//     const categories: ModelCategoryResponse[] = [
//       { id: 1, name: 'Category 1' },
//       { id: 2, name: 'Category 2' },
//     ];

//     return HttpResponse.json(categories);
//   }),

//   // 모델 결과 조회 핸들러
//   http.get('/api/results/model/:modelId', ({ params }) => {
//     const modelId = Array.isArray(params.modelId)
//       ? parseInt(params.modelId[0], 10)
//       : parseInt(params.modelId as string, 10);
//     console.log(modelId);
//     const results: ResultResponse[] = [
//       {
//         id: 1,
//         precision: 0.85,
//         recall: 0.8,
//         fitness: 0.9,
//         ratio: 0.75,
//         epochs: 50,
//         batch: 32,
//         lr0: 0.001,
//         lrf: 0.0001,
//         optimizer: 'ADAM',
//         map50: 0.92,
//         map5095: 0.88,
//       },
//       {
//         id: 2,
//         precision: 0.87,
//         recall: 0.82,
//         fitness: 0.91,
//         ratio: 0.77,
//         epochs: 40,
//         batch: 16,
//         lr0: 0.001,
//         lrf: 0.00005,
//         optimizer: 'SGD',
//         map50: 0.93,
//         map5095: 0.89,
//       },
//     ];

//     return HttpResponse.json(results);
//   }),

//   // 모델 보고서 조회 핸들러
//   http.get('/api/projects/:projectId/reports/model/:modelId', ({ params }) => {
//     const projectId = Array.isArray(params.projectId)
//       ? parseInt(params.projectId[0], 10)
//       : parseInt(params.projectId as string, 10);
//     const modelId = Array.isArray(params.modelId)
//       ? parseInt(params.modelId[0], 10)
//       : parseInt(params.modelId as string, 10);
//     console.log(projectId);
//     const reports: ReportResponse[] = [
//       {
//         modelId: modelId,
//         totalEpochs: 5,
//         epoch: 1,
//         boxLoss: 0.05,
//         clsLoss: 0.04,
//         dflLoss: 0.03,
//         fitness: 0.88,
//         epochTime: 110,
//         leftSecond: 1000,
//       },
//       {
//         modelId: modelId,
//         totalEpochs: 5,
//         epoch: 2,
//         boxLoss: 0.04,
//         clsLoss: 0.035,
//         dflLoss: 0.025,
//         fitness: 0.89,
//         epochTime: 115,
//         leftSecond: 900,
//       },
//       {
//         modelId: modelId,
//         totalEpochs: 5,
//         epoch: 3,
//         boxLoss: 0.03,
//         clsLoss: 0.03,
//         dflLoss: 0.02,
//         fitness: 0.9,
//         epochTime: 120,
//         leftSecond: 800,
//       },
//       {
//         modelId: modelId,
//         totalEpochs: 5,
//         epoch: 4,
//         boxLoss: 0.025,
//         clsLoss: 0.028,
//         dflLoss: 0.018,
//         fitness: 0.91,
//         epochTime: 125,
//         leftSecond: 700,
//       },
//       {
//         modelId: modelId,
//         totalEpochs: 5,
//         epoch: 5,
//         boxLoss: 0.02,
//         clsLoss: 0.025,
//         dflLoss: 0.015,
//         fitness: 0.92,
//         epochTime: 130,
//         leftSecond: 600,
//       },
//     ];

//     return HttpResponse.json(reports);
//   }),
// ];
