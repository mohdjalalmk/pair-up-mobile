import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

interface Props {
  focused: boolean;
  icon: string;
}

const TabIcon: React.FC<Props> = ({ focused, icon }) => {
  return (
    <View style={[styles.iconContainer, focused && styles.focused]}>
      <Icon size={24} name={icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17.5,
    backgroundColor: 'transparent',
  },
  focused: {
    backgroundColor: '#798c86',
  },
  iconImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});

export default TabIcon;
