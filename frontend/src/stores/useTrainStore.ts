import { create } from 'zustand';

interface TrainingData {
  epoch: number;
  total_epochs: number;
  box_loss: number;
  cls_loss: number;
  dfl_loss: number;
  fitness: number;
  epoch_time: number;
  left_second: number;
}

interface StoreState {
  trainingDataByProject: { [projectId: string]: TrainingData[] };
  addTrainingData: (projectId: string, data: TrainingData) => void;
  resetTrainingData: (projectId: string) => void;
}

const useTrainStore = create<StoreState>((set) => ({
  trainingDataByProject: {},

  addTrainingData: (projectId: string, data: TrainingData) =>
    set((state) => ({
      trainingDataByProject: {
        ...state.trainingDataByProject,
        [projectId]: [...(state.trainingDataByProject[projectId] || []), data],
      },
    })),

  resetTrainingData: (projectId: string) =>
    set((state) => ({
      trainingDataByProject: {
        ...state.trainingDataByProject,
        [projectId]: [],
      },
    })),
}));

export default useTrainStore;
