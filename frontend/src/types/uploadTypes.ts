export interface UploadZipParams {
  memberId: number;
  projectId: number;
  folderId: number;
  file: File;
  progressCallback: (progress: number) => void;
}

export interface UploadFolderParams {
  memberId: number;
  projectId: number;
  folderId: number;
  files: File[];
  progressCallback: (progress: number) => void;
}
