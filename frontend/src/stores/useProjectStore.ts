import { create } from 'zustand';
import { LabelCategoryResponse, Project } from '@/types';

interface ProjectState {
  project: Project | null;
  setProject: (project: Project | null) => void;
  folderId: number;
  setFolderId: (folderId: number) => void;
  categories: LabelCategoryResponse[];
  setCategories: (categories: LabelCategoryResponse[]) => void;
}

const useProjectStore = create<ProjectState>((set) => ({
  project: null,
  setProject: (project) => set({ project }),
  folderId: 0,
  setFolderId: (folderId) => set({ folderId }),
  categories: [],
  setCategories: (categories) => set({ categories }),
}));

export default useProjectStore;
