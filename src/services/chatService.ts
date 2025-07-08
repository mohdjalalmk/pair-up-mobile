import api from '../api/axiosInstance';

export const getChatWithUser = async (targetUserId: string) => {
  try {
    const response = await api.get(`/chat/${targetUserId}`);

    return response.data;
  } catch (error: any) {
    throw error;
  }
};
