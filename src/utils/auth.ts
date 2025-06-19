// src/utils/auth.ts
import * as Keychain from 'react-native-keychain';

const SERVICE_NAME = 'my_app_token'; // Optional: Used to namespace storage

export const storeToken = async (token: string): Promise<void> => {
  try {
    await Keychain.setGenericPassword('auth', token, {
      service: SERVICE_NAME,
    });
  } catch (error) {
    console.error('Failed to store token', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({ service: SERVICE_NAME });
    if (credentials) {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.error('Failed to get token', error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({ service: SERVICE_NAME });
  } catch (error) {
    console.error('Failed to remove token', error);
  }
};
