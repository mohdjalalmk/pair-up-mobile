import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import SignInScreen from '../screens/SignInScreen';

const Stack = createNativeStackNavigator();

// Simulated token (replace with real logic later)
const token = 'sample_token'; // If null/undefined → Auth screen

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        // Main App Flow (Tabs + Stack)
        <Stack.Screen name="MainApp" component={BottomTabs} />
      ) : (
        // Auth Flow
        <Stack.Screen name="SignIn" component={SignInScreen} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
