import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
  children: React.ReactNode;
  onPress: () => void;
}

const CustomTabBarButton: React.FC<Props> = ({ children, onPress }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <View style={styles.innerCircle}>{children}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    top: -25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF5A5F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});


export default CustomTabBarButton;
