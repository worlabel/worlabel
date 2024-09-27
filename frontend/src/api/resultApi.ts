import api from '@/api/axiosConfig';
import { ResultResponse } from '@/types';

export async function getModelResult(modelId: number) {
  return api.get<ResultResponse[]>(`/results/model/${modelId}`).then(({ data }) => data);
}
