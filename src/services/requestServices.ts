import api from '../api/axiosInstance';
import Toast from 'react-native-toast-message';

export const getReceivedRequests = async (): Promise<any[]> => {
  try {
    const res = await api.get('/user/requests/received');
    return res.data.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to fetch requests',
      text2: error?.response?.data?.message || 'Something went wrong',
    });
    throw error;
  }
};

export const acceptRequest = async (userId: string): Promise<void> => {
  try {
    await api.post(`/request/accept/${userId}`);
    Toast.show({ type: 'success', text1: 'Request accepted' });
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to accept request',
      text2: error?.response?.data?.message || 'Please try again',
    });
    throw error;
  }
};

export const rejectRequest = async (userId: string): Promise<void> => {
  try {
    await api.post(`/request/reject/${userId}`);
    Toast.show({ type: 'info', text1: 'Request rejected' });
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to reject request',
      text2: error?.response?.data?.message || 'Please try again',
    });
    throw error;
  }
};
