import Toast from 'react-native-toast-message';
import api from '../api/axiosInstance';

export const createOrder = async () => {
  try {
    const response = await api.post('/payments/create-order', {
      currency: 'INR',
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Update failed',
      text2: error.message,
      position: 'bottom',
    });
  }
};
