import api from '../api/axiosInstance';

export const getUserFeed = async () => {
  try {
    const response = await api.get('/user/feed');
    return response.data.data;
  } catch (error) {
    
  }
};
