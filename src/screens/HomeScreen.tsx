import React, { useEffect, useState } from 'react';
import {
  View,
  Button,
  ActivityIndicator,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import Keychain from 'react-native-keychain';
import api from '../api/axiosInstance';
import { SwipeCard } from '../components/SwipeCard';
import AppScreen from '../components/AppScreen';
import { getUserFeed } from '../services/userService';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    setLoading(true);
  const data = await getUserFeed();
  setFeed(data);
  setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleLogout = async () => {
    await Keychain.resetGenericPassword();
    useAuthStore.getState().logout();
  };

  const renderCard = (item: any) => (
    <View style={[styles.card, styles.shadow]}>
      <View style={styles.imageContainer}>
        <Image
          source={require(`../../assets/images/img1.jpeg`)} // Dummy profile picture
          style={styles.profileImage}
          resizeMode="cover"
        />
        <View style={styles.nameOverlay}>
          <Text style={styles.nameText}>{item.firstName}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <AppScreen>
      <View style={styles.container}>
        <Button title="Log out" onPress={handleLogout} />

        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : (
          <SwipeCard
            data={feed}
            renderCard={renderCard}
            onSwipeLeft={item => console.log('Swiped Left:', item)}
            onSwipeRight={item => console.log('Swiped Right:', item)}
            onSwipeTop={item => console.log('Swiped Top:', item)}
          />
        )}
      </View>
    </AppScreen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    // paddingHorizontal: 20,
  },
  card: {
    width: width * 0.9,
    height: 500,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 0.2,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  nameOverlay: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  nameText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8, // For Android
  },
});
