// services/userService.ts
import api from '../api/axiosInstance';

export const getUserFeed = async (page = 1): Promise<any[]> => {
  try {
    const response = await api.get(`/user/feed?page=${page}&limit=4`);
    return response.data.data; // Ensure your backend supports pagination
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch feed');
  }
};

export const sendSwipeResponse = async (
  status: 'interested' | 'ignored',
  toUserId: string,
) => {
  const res = await api.post(`/request/send/${status}/${toUserId}`);
  console.log('res', res);

  return res.data;
};
