import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import Keychain from 'react-native-keychain';
import api from '../api/axiosInstance';
import FeedCard from '../components/FeedCard';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeed = async (pageNum = 1) => {
    try {
      const res = await api.get(`/user/feed?page=${pageNum}&limit=18`);
      const newData = res.data.data;

      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setFeed(prev => [...prev, ...newData]);
      }
    } catch (err) {
      console.error('Failed to load feed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleLogout = async () => {
    await Keychain.resetGenericPassword();
    useAuthStore.getState().logout();
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFeed(nextPage);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Log out" onPress={handleLogout} />

      {loading && page === 1 ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={feed}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <FeedCard name={item.firstName} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? <ActivityIndicator style={{ margin: 10 }} /> : null
          }
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  listContent: {
    paddingVertical: 10,
  },
});
