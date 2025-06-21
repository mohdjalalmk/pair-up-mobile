import React from 'react';
import { View, Image, ImageSourcePropType, StyleSheet } from 'react-native';

interface Props {
  focused: boolean;
  icon: ImageSourcePropType;
}

const TabIcon: React.FC<Props> = ({ focused, icon }) => {
  return (
    <View style={[styles.iconContainer, focused && styles.focused]}>
      <Image source={icon} style={styles.iconImage} />
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
    backgroundColor: '#7EC8E3',
  },
  iconImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});


export default TabIcon;
