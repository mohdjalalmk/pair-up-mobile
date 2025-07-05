import { create } from 'zustand';

export interface User {
  premiumExpiry: Date;
  isPremium: Boolean;
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  gender: string;
  description: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
  photoUrl: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (updatedUser: Partial<User>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>(set => ({
  user: null,
  setUser: user => set({ user }),

  updateUser: updatedUser =>
    set(state => ({
      user: state.user ? { ...state.user, ...updatedUser } : null,
    })),

  clearUser: () => set({ user: null }),
}));
