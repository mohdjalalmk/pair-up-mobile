// services/userService.ts
import api from '../api/axiosInstance';
import axios, { AxiosError } from 'axios';
import { User } from '../store/userStore';
import Toast from 'react-native-toast-message';

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

export const updateProfile = async (formData: FormData) => {
  try {
    const resp = await api.patch('/profile/edit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return resp;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || 'Failed to update profile',
    );
  }
};

export const getReceivedConnections = async (): Promise<any[]> => {
  try {
    const res = await api.get('/user/requests/accepted');
    return res.data.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to fetch connections',
      text2: error?.response?.data?.message || 'Something went wrong',
    });
    throw error;
  }
};
