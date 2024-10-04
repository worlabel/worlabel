import { create } from 'zustand';
import { FolderResponse, LabelCategoryResponse, Project } from '@/types';

interface ProjectState {
  project: Project | null;
  setProject: (project: Project | null) => void;
  folderId: number;
  setFolderId: (folderId: number) => void;
  categories: LabelCategoryResponse[];
  setCategories: (categories: LabelCategoryResponse[]) => void;
  projectFolder: FolderResponse;
}

const useProjectStore = create<ProjectState>((set) => ({
  project: null,
  setProject: (project) => set({ project }),
  folderId: 0,
  setFolderId: (folderId) => set({ folderId }),
  categories: [],
  projectFolder: {
    id: 0,
    title: '',
    children: [],
    images: [],
  },
  setCategories: (categories) => set({ categories }),
}));

export default useProjectStore;
