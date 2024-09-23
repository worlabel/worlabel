import { LabelJson } from '@/types';
import axios from 'axios';

export async function getLabelJson(jsonPath: string) {
  return axios
    .get<LabelJson>(jsonPath, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
    .then(({ data }) => data);
}
