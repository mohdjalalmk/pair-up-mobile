import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '@env';

const api = axios.create({
  //for local
  // baseURL: 'http://localhost:3000/',
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to headers before request
api.interceptors.request.use(
  async config => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Handle response errors globally (optional: for refresh logic)
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await removeToken(); // clear Keychain / storage
      useAuthStore.getState().logout(); // clear Zustand and re-render UI
    }
    return Promise.reject(error);
  },
);

export default api;
