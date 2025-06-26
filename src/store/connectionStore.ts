import { create } from 'zustand';

export interface ConnectionUser {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  description: string;
}

interface ConnectionStore {
  connections: ConnectionUser[];
  setConnections: (data: ConnectionUser[]) => void;
}

export const useConnectionStore = create<ConnectionStore>(set => ({
  connections: [],
  setConnections: data => set({ connections: data }),
}));
