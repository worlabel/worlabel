// 파일 및 디렉터리 관련 타입
export type FileItem = {
  id: number;
  name: string;
  url: string;
  type: 'image' | 'json';
  status: 'idle' | 'done';
};

export type DirectoryItem = {
  id: number;
  name: string;
  type: 'directory';
  children: Array<DirectoryItem | FileItem>;
};

export type Project = {
  id: number;
  name: string;
  type: 'classification' | 'detection' | 'segmentation';
  children: Array<DirectoryItem | FileItem>;
};
export type Workspace = {
  id: number;
  name: string;
  projects: Array<Project>;
};
