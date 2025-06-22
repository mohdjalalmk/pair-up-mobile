import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import CustomTabBarButton from '../components/CustomTabBarButton';
import TabIcon from '../components/TabIcon';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          ...styles.tabBarStyle,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={require('../../assets/images/home.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Screen 2"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={require('../../assets/images/chat.png')}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Screen 3"
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('../../assets/images/mgic.png')}
              style={styles.icon}
            />
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      /> */}
      <Tab.Screen
        name="Screen 4"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={require('../../assets/images/star.webp')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Screen 5"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={require('../../assets/images/home.png')}
            />
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
