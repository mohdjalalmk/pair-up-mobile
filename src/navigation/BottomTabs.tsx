import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
// import Icon from 'react-native-vector-icons/Ionicons';

export type BottomTabParamList = {
  Home: undefined;
  Auth: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // tabBarIcon: ({ color, size }) => {
        //   let iconName = route.name === 'Home' ? 'home-outline' : 'log-in-outline';
        //   return <Icon name={iconName} size={size} color={color} />;
        // },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs
