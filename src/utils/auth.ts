import EncryptedStorage from 'react-native-encrypted-storage';

const TOKEN_KEY = 'auth_token';

export const storeToken = async (token: string): Promise<void> => {
  try {
    await EncryptedStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to store token', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    const token = await EncryptedStorage.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Failed to get token', error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await EncryptedStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove token', error);
  }
};
