import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SwipeCard } from '../components/SwipeCard';
import AppScreen from '../components/AppScreen';
import { getUserFeed, sendSwipeResponse } from '../services/userService';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

//TODO: Hvae some issues with data handling in onswipe right,left , FIX
const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchFeed = async (currentPage = 1) => {
    console.log('fetching ,', currentPage);

    try {
      if (currentPage === 1) setLoading(true);
      const data = await getUserFeed(currentPage);
      if (!data?.length) {
        setHasMore(false);
        return;
      }
 
      setFeed(prev => (currentPage === 1 ? data : [...prev, ...data]));
    } catch (err: any) {
      console.error('Error fetching feed:', err);
      Toast.show({
        type: 'error',
        text1: 'Failed to load feed',
        text2: err?.message || 'Please try again later',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchFeed(1);
  }, []);

  const fetchNextPage = useCallback(() => {
    console.log('has', hasMore);

    if (!hasMore || isFetchingMore) return;
    setIsFetchingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed(nextPage);
  }, [page, hasMore, isFetchingMore]);

  const handleSwipeLeft = async (item: any) => {
    try {
      await sendSwipeResponse('ignored', item._id);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Swipe Failed',
        text2: 'Unable to send ignored status',
        position: 'bottom',
      });
    }
  };

  const handleSwipeRight = async (item: any) => {
    try {
      await sendSwipeResponse('interested', item._id);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Swipe Failed',
        text2: 'Unable to send interested status',
        position: 'bottom',
      });
    }
  };

  const renderCard = (item: any) => (
    <View style={[styles.card, styles.shadow]}>
      <View style={styles.imageContainer}>
        <Image
          source={
            item.photoUrl
              ? { uri: item.photoUrl }
              : require('../../assets/images/profile.png')
          }
          style={styles.profileImage}
          resizeMode="cover"
        />
        <View style={styles.detailsOverlay}>
          <Text style={styles.nameText}>{item.firstName}</Text>
          <Text style={styles.subText}>
            {item.age} |{' '}
            {item.gender?.charAt(0).toUpperCase() + item.gender?.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <AppScreen>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : (
          <SwipeCard
            data={feed}
            renderCard={renderCard}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onSwipeTop={item => console.log('Swiped Top:', item)}
            onEndReached={fetchNextPage}
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
  detailsOverlay: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  subText: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
});
