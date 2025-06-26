import api from '../api/axiosInstance';
import Toast from 'react-native-toast-message';

export const getReceivedRequests = async (): Promise<any[]> => {
  try {
    const res = await api.get('/user/requests/received');
    return res.data.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const acceptRequest = async (requestId: string): Promise<void> => {
  try {
    const resp = await api.post(`/request/review/accepted/${requestId}`);

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

export const rejectRequest = async (requestId: string): Promise<void> => {
  try {
    await api.post(`/request/review/rejected/${requestId}`);
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


