import { create } from 'zustand';
import { ReportResponse } from '@/types';

interface ModelStoreState {
  trainingDataByProject: Record<string, ReportResponse[]>;
  isTrainingByProject: Record<string, boolean>;
  isTrainingCompleteByProject: Record<string, boolean>;
  selectedModelByProject: Record<string, number | null>;

  setIsTraining: (projectId: string, status: boolean) => void;
  setIsTrainingComplete: (projectId: string, status: boolean) => void;
  saveTrainingData: (projectId: string, data: ReportResponse[]) => void;
  resetTrainingData: (projectId: string) => void;
  selectModel: (projectId: string, modelId: number | null) => void;
}

const useModelStore = create<ModelStoreState>((set) => ({
  trainingDataByProject: {},
  isTrainingByProject: {},
  isTrainingCompleteByProject: {},
  selectedModelByProject: {},

  setIsTraining: (projectId, status) =>
    set((state) => ({
      isTrainingByProject: {
        ...state.isTrainingByProject,
        [projectId]: status,
      },
    })),

  setIsTrainingComplete: (projectId, status) =>
    set((state) => ({
      isTrainingCompleteByProject: {
        ...state.isTrainingCompleteByProject,
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

  resetTrainingData: (projectId) =>
    set((state) => ({
      trainingDataByProject: {
        ...state.trainingDataByProject,
        [projectId]: [],
      },
    })),

  selectModel: (projectId, modelId) =>
    set((state) => ({
      selectedModelByProject: {
        ...state.selectedModelByProject,
        [projectId]: modelId,
      },
      trainingDataByProject: {
        ...state.trainingDataByProject,
        [projectId]: [],
      },
      isTrainingByProject: {
        ...state.isTrainingByProject,
        [projectId]: false,
      },
      isTrainingCompleteByProject: {
        ...state.isTrainingCompleteByProject,
        [projectId]: false,
      },
    })),
}));

export default useModelStore;
