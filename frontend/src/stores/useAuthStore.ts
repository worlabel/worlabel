import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MemberResponse } from '@/types';

interface AuthState {
  accessToken: string;
  profile: MemberResponse | null;
  setToken: (token: string) => void;
  setProfile: (profile: MemberResponse) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      accessToken: '',
      profile: null,
      setToken: (token: string) => set({ accessToken: token }),
      setProfile: (profile: MemberResponse) => set({ profile }),
      clearAuth: () => set({ accessToken: '', profile: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
