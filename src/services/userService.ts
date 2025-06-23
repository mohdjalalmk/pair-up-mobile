// services/userService.ts
import api from '../api/axiosInstance';
import axios, { AxiosError } from 'axios';

export const getUserFeed = async (page = 1): Promise<any[]> => {
  try {
    const response = await api.get(`/user/feed?page=${page}&limit=4`);
    return response.data.data; // Ensure your backend supports pagination
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

export const sendSwipeResponse = async (
  status: 'interested' | 'ignored',
  toUserId: string,
): Promise<any> => {
  try {
    const response = await api.post(`/request/send/${status}/${toUserId}`);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    throw new Error(
      error.response?.data?.message || 'Failed to send swipe response',
    );
  }
};
// services/userService.ts
export const viewProfile = async (): Promise<any> => {
  try {
    const response = await api.get(`/profile/view`);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};
