import { AxiosProgressEvent } from 'axios';
import api from './axiosConfig';

export async function uploadFilesToProject(
  files: File[],
  onUploadProgress: (progress: number) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) {
  alert('개발 중 입니다.');

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  // TODO: api.post()를 return하고 사이드 이펙트는 외부에서 처리하도록 수정
  return api
    .post('/projects/{project_id}', formData, {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(progress);
        }
      },
    })
    .then((response) => {
      if (response.status === 200) {
        onComplete();
      } else {
        throw new Error('Upload failed');
      }
    })
    .catch((error) => {
      onError(error as Error);
    });
}
