// 레이블 관련 타입
export type Label = {
  id: number;
  categoryId: number;
  color: string;
  type: 'polygon' | 'rectangle' | 'point';
  coordinates: Array<[number, number]>;
};

export interface LabelingRequest {
  memberId: number;
  projectId: number;
  imageId: number;
}

export interface AutoLabelingResponse {
  imageId: number;
  imageUrl: string;
  data: string;
}

// 레이블 저장 요청 DTO
export interface LabelSaveRequest {
  data: string;
}

export interface Shape {
  categoryId: number;
  color: string;
  points: [number, number][];
  group_id: number;
  shape_type: 'polygon' | 'rectangle' | 'point';
  flags: Record<string, never>;
}

export interface LabelJson {
  version: string;
  task_type: 'cls' | 'det' | 'seg';
  shapes: Shape[];
  split: string;
  imageHeight: number;
  imageWidth: number;
  imageDepth: number;
}

export interface LabelCategoryResponse {
  id: number;
  labelName: string;
}
// 카테고리 요청 DTO
export interface LabelCategoryRequest {
  labelCategoryList: number[];
}
