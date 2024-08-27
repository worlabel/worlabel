import axios, { AxiosProgressEvent } from 'axios';

export async function uploadFiles(
  files: File[],
  onUploadProgress: (progress: number) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> {
  alert('개발 중 입니다.');

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await axios.post('/api/projects/{project_id}', formData, {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(progress);
        }
      },
    });

    if (response.status === 200) {
      onComplete();
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    onError(error as Error);
  }
}
