import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MemberResponseDTO } from '@/types';

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string;
  profile: MemberResponseDTO | null;
  setLoggedIn: (status: boolean, token: string) => void;
  setProfile: (profile: MemberResponseDTO) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: '',
      profile: null,
      setLoggedIn: (status, token) => set({ isLoggedIn: status, accessToken: token }),
      setProfile: (profile) => set({ profile }),
      clearAuth: () => set({ isLoggedIn: false, accessToken: '', profile: null }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => sessionStorage,
    }
  )
);

export default useAuthStore;
