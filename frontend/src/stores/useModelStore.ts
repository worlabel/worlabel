import { create } from 'zustand';
import { ReportResponse } from '@/types';

interface ModelStoreState {
  trainingDataByProject: Record<string, ReportResponse[]>;
  isTrainingByProject: Record<string, boolean>;
  selectedModelByProject: Record<string, number | null>;
  setIsTraining: (projectId: string, status: boolean) => void;
  saveTrainingData: (projectId: string, data: ReportResponse[]) => void;
  setSelectedModel: (projectId: string, modelId: number | null) => void;
  resetTrainingData: (projectId: string) => void;
}

const useModelStore = create<ModelStoreState>((set) => ({
  trainingDataByProject: {},
  isTrainingByProject: {},
  selectedModelByProject: {},
  setIsTraining: (projectId, status) =>
    set((state) => ({
      isTrainingByProject: {
        ...state.isTrainingByProject,
        [projectId]: status,
      },
    })),
  saveTrainingData: (projectId, data) =>
    set((state) => ({
      trainingDataByProject: {
        ...state.trainingDataByProject,
        [projectId]: data,
      },
    })),
  setSelectedModel: (projectId, modelId) =>
    set((state) => ({
      selectedModelByProject: {
        ...state.selectedModelByProject,
        [projectId]: modelId,
      },
    })),
  resetTrainingData: (projectId) =>
    set((state) => ({
      trainingDataByProject: {
        ...state.trainingDataByProject,
        [projectId]: [],
      },
      selectedModelByProject: {
        ...state.selectedModelByProject,
        [projectId]: null,
      },
      isTrainingByProject: {
        ...state.isTrainingByProject,
        [projectId]: false,
      },
    })),
}));

export default useModelStore;
