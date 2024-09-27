import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MemberResponse } from '@/types';

interface AuthState {
  accessToken: string;
  profile: MemberResponse | null;
  fcmToken: string;
  setToken: (token: string) => void;
  setProfile: (profile: MemberResponse) => void;
  setFcmToken: (fcmToken: string) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: '',
      profile: null,
      fcmToken: '',
      setToken: (token: string) => set({ accessToken: token }),
      setProfile: (profile: MemberResponse) => set({ profile }),
      setFcmToken: (fcmToken: string) => set({ fcmToken }),
      clearAuth: () => set({ accessToken: '', profile: null, fcmToken: '' }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
