import { create } from 'zustand';
import { User } from './userStore';

interface Request {
  _id: string;
  fromUser: User;
}

interface RequestStore {
  requests: Request[];
  setRequests: (reqs: Request[]) => void;
  removeRequest: (id: string) => void;
  clearRequests: () => void;
}

export const useRequestStore = create<RequestStore>(set => ({
  requests: [],
  setRequests: reqs => set({ requests: reqs }),
  removeRequest: id =>
    set(state => ({
      requests: state.requests.filter(r => r._id !== id),
    })),
  clearRequests: () => set({ requests: [] }),
}));
