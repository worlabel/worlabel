import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MemberResponse } from '@/types';

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string;
  profile: MemberResponse | null;
  setLoggedIn: (status: boolean, token: string) => void;
  setProfile: (profile: MemberResponse) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: '',
      profile: null,
      setLoggedIn: (status: boolean, token: string) => set({ isLoggedIn: status, accessToken: token }),
      setProfile: (profile: MemberResponse) => set({ profile }),
      clearAuth: () => set({ isLoggedIn: false, accessToken: '', profile: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
