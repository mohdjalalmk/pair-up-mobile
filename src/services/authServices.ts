// src/services/authService.ts
import * as Keychain from 'react-native-keychain';
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { storeToken } from '../utils/auth';

export const login = async (email: string, password: string) => {
  try {
    console.log('jjjjjj');

    const response = await api.post('/login', {
      email: email.toLowerCase().trim(),
      password,
    });
    console.log('response from login:', response);

    const token = response.data.token;

    // Save to secure storage
    await storeToken(token);

    // Save to Zustand
    useAuthStore.getState().setToken(token);

    return { success: true };
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed',
    };
  }
};
