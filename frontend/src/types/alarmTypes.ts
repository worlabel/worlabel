export interface AlarmResponse {
  id: number;
  isRead: boolean;
  createdAt: string;
  type: 'PREDICT' | 'TRAIN' | 'IMAGE' | 'COMMENT' | 'REVIEW_RESULT' | 'REVIEW_REQUEST';
}
