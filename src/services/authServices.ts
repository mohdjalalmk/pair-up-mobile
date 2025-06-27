import * as Keychain from 'react-native-keychain';
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { storeToken } from '../utils/auth';
import Toast from 'react-native-toast-message';
import { useUserStore } from '../store/userStore';

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/login', {
      email: email.toLowerCase().trim(),
      password,
    });

    const token = response.data.token;
    const user = response.data.user;

    await storeToken(token);

    useAuthStore.getState().setToken(token);
    useUserStore.getState().setUser(user);

    return { user: response.data.token };
  } catch (error: any) {
    console.log('error', JSON.stringify(error));

    Toast.show({
      type: 'error',
      text1: 'Failed to login',
      text2: 'Invalid credentials',
      position: 'bottom',
    });
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/logout');
    console.log('Responces', response);
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Failed to logout',
      text2: err?.message || 'Please try again later',
      position: 'bottom',
    });
  }
};

export const signupUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: string;
  gender: string;
}) => {
  try {
    const response = await api.post(`/signup`, userData);
    const token = response.data.token;
    const user = response.data.user;

    await storeToken(token);

    useAuthStore.getState().setToken(token);
    useUserStore.getState().setUser(user);
    return response.data;
  } catch (error: any) {
    console.error('Signup error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteAccount = async () => {
  try {
    await api.delete('/user/delete');
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Failed to delete',
      text2: err?.message || 'Please try again later',
      position: 'bottom',
    });
  }
};
