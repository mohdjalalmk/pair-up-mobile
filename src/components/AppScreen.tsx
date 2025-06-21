import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

interface AppScreenProps {
  children: React.ReactNode;
}

const AppScreen = ({ children }: AppScreenProps) => {
  return (
    <LinearGradient
      colors={['#FFDEE9', '#B5FFFC']} // 🎨 soft dating-app colors
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.container}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    // flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    // flex: 1,
    // paddingHorizontal: 16,
    paddingBottom: 10,
  },
});

export default AppScreen;
