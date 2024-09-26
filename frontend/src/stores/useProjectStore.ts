import { create } from 'zustand';
import { Project } from '@/types';

interface ProjectState {
  project: Project | null;
  setProject: (project: Project | null) => void;
  folderId: number;
  setFolderId: (folderId: number) => void;
}

const useProjectStore = create<ProjectState>((set) => ({
  project: null,
  setProject: (project) => set({ project }),
  folderId: 0,
  setFolderId: (folderId) => set({ folderId }),
}));

export default useProjectStore;
