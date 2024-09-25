import { create } from 'zustand';
import { Project } from '@/types';

interface ProjectState {
  project: Project | null;
  setProject: (project: Project | null) => void;
}

const useProjectStore = create<ProjectState>((set) => ({
  project: null,
  setProject: (project) => set({ project }),
}));

export default useProjectStore;
