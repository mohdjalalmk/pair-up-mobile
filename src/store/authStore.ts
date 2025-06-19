// src/store/authStore.ts
import { create } from 'zustand';

type AuthState = {
  token: string | null;
  isLoggedIn: boolean;
  isBootstrapping: boolean;
  setToken: (token: string) => void;
  logout: () => void;
  finishBootstrapping: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoggedIn: false,
  isBootstrapping: true,
  setToken: (token) =>
    set({ token, isLoggedIn: true }),
  logout: () =>
    set({ token: null, isLoggedIn: false }),
  finishBootstrapping: () =>
    set({ isBootstrapping: false }),
}));
