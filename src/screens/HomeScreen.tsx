import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import Keychain from 'react-native-keychain';

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Log out"
        onPress={async () => {
          await Keychain.resetGenericPassword();
          useAuthStore.getState().logout();
        }}
      />
    </View>
  );
};

export default HomeScreen;
