// src/api/axiosInstance.ts
import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';

const api = axios.create({
  baseURL: 'https://your-api.com',
  timeout: 10000,
  withCredentials: true, // only needed if using cookie-based auth
});

// Add token to headers before request
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors globally (optional: for refresh logic)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Optionally: handle token refresh logic here
      await removeToken(); // or redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
