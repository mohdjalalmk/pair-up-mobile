import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import TabIcon from '../components/TabIcon';
import ProfileScreen from '../screens/ProfileScreen';
import ReceivedRequestsScreen from '../screens/ReceivedRequests';
import ChatStack from './ChatStack';
import {
  getFocusedRouteNameFromRoute,
  RouteProp,
} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const getTabBarStyle = (route: RouteProp<any>) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';
    if (routeName === 'ChatScreen') {
      return { display: 'none' };
    }
    return styles.tabBarStyle;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: getTabBarStyle(route),
      })}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={'home'} />
          ),
        }}
      />
      <Tab.Screen
        name="connections"
        component={ChatStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={'chat'} />
          ),
        }}
      />
      <Tab.Screen
        name="Screen 3"
        component={ReceivedRequestsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={'colours'} />
          ),
        }}
      />
      <Tab.Screen
        name="Screen 4"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={'user'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: 35,
    left: 20,
    right: 20,
    borderRadius: 50,
    paddingTop: 10,
    marginHorizontal: 20,
    height: 60,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  icon: {
    height: 45,
    width: 45,
  },
});

export default BottomTabs;
