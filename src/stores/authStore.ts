import { create } from 'zustand';

interface AuthState {
  user: { name: string; apt: string } | null;
  setUser: (u: AuthState['user']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    set({ user: null });
    document.cookie = 'access_token=; Max-Age=0';
  },
}));
