import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileData {
  id: number | null;
  nickname: string;
  profileImage: string;
}

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string;
  profile: ProfileData;
  setLoggedIn: (status: boolean, token: string) => void;
  setProfile: (profile: ProfileData) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: '',
      profile: { id: null, nickname: '', profileImage: '' },
      setLoggedIn: (status, token) => set({ isLoggedIn: status, accessToken: token }),
      setProfile: (profile) => set({ profile }),
      clearAuth: () =>
        set({ isLoggedIn: false, accessToken: '', profile: { id: null, nickname: '', profileImage: '' } }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
