// src/api/axiosInstance.ts
import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: 'http://localhost:3000/', // Change to your server IP if testing on device
  timeout: 10000,
});

// Add token to headers before request
api.interceptors.request.use(
  async config => {
    console.log('here');

    const token = await getToken();
    console.log('Token in Axios:', token); // ✅ ADD THIS

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('token:', token);
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
