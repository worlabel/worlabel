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
  type: 'Classification' | 'Detection' | 'Segmentation';
  children: Array<DirectoryItem | FileItem>;
};

export type Workspace = {
  id: number;
  name: string;
  projects: Array<Project>;
};

export type Label = {
  id: number;
  name: string;
  color: string;
};
