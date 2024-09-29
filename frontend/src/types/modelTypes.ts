// 모델 카테고리 응답 DTO
export interface ModelCategoryResponse {
  id: number;
  name: string;
}

// 모델 요청 DTO (API로 전달할 데이터 타입)
export interface ModelRequest {
  name: string;
}

// 모델 응답 DTO (API로부터 받는 데이터 타입)
export interface ModelResponse {
  id: number;
  name: string;
  isDefault: boolean;
  isTrain: boolean;
  projectType: 'classification' | 'detection' | 'segmentation';
}

// 프로젝트 모델 리스트 응답 DTO
export interface ProjectModelsResponse extends Array<ModelResponse> {}
// 모델 훈련 요청 DTO
export interface ModelTrainRequest {
  modelId: number;
  ratio: number;
  epochs: number;
  batch: number;
  lr0: number;
  lrf: number;
  optimizer: 'AUTO' | 'SGD' | 'ADAM' | 'ADAMW' | 'NADAM' | 'RADAM' | 'RMSPROP';
}
