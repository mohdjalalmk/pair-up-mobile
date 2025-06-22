// App.tsx
import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/RootNavigator';
import { useAuthStore } from './src/store/authStore';
import { NavigationContainer } from '@react-navigation/native';
import { getToken } from './src/utils/auth';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/utils/toastConfig';

const App = () => {
  const setToken = useAuthStore(s => s.setToken);
  const finishBootstrapping = useAuthStore(s => s.finishBootstrapping);

  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken();
      if (token) {
        setToken(token);
      }
      finishBootstrapping();
    };

    loadToken();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
};

export default App;
