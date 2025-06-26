// navigation/ChatStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConnectionsScreen from '../screens/ConnectionScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator();

const ChatStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Connections"
        component={ConnectionsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params?.name || 'Chat',
          headerShown:false
        })}
      />
    </Stack.Navigator>
  );
};

export default ChatStack;
