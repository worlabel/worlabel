import { Label } from '@/types';
import { create } from 'zustand';

interface CanvasState {
  sidebarSize: number;
  image: string;
  labels: Label[];
  drawState: 'pen' | 'rect' | 'pointer';
  setSidebarSize: (width: number) => void;
  changeImage: (image: string, labels: Label[]) => void;
  setLabels: (labels: Label[]) => void;
  addLabel: (label: Label) => void;
  removeLabel: (labelId: number) => void;
  updateLabel: (label: Label) => void;
  setDrawState: (state: 'pen' | 'rect' | 'pointer') => void;
}

const useCanvasStore = create<CanvasState>()((set) => ({
  sidebarSize: 20,
  image: '',
  labels: [],
  drawState: 'pointer',
  setSidebarSize: (width) => set({ sidebarSize: width }),
  changeImage: (image: string, labels: Label[]) => set({ image, labels }),
  addLabel: (label: Label) => set((state) => ({ labels: [...state.labels, label] })),
  setLabels: (labels) => set({ labels }),
  removeLabel: (labelId: number) => set((state) => ({ labels: state.labels.filter((label) => label.id !== labelId) })),
  updateLabel: (label: Label) => set((state) => ({ labels: state.labels.map((l) => (l.id === label.id ? label : l)) })),
  setDrawState: (drawState) => set({ drawState }),
}));

export default useCanvasStore;
