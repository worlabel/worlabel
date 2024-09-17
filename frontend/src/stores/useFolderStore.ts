import { create } from 'zustand';
import { FolderResponse } from '@/types';

interface FolderState {
  folder: FolderResponse | null;
  loading: boolean;
  error: string | null;
  setFolder: (folder: FolderResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const useFolderStore = create<FolderState>((set) => ({
  folder: null,
  loading: false,
  error: null,
  setFolder: (folder) => set({ folder }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export default useFolderStore;
