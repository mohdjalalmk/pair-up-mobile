// App.tsx
import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/RootNavigator';
import * as Keychain from 'react-native-keychain';
import { useAuthStore } from './src/store/authStore';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  const setToken = useAuthStore(s => s.setToken);
  const finishBootstrapping = useAuthStore(s => s.finishBootstrapping);

  useEffect(() => {
    const loadToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        setToken(credentials.password);
      }
      finishBootstrapping();
    };

    loadToken();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
