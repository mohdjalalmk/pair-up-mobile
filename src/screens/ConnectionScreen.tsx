import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { getReceivedConnections } from '../services/userService';
import { useConnectionStore } from '../store/connectionStore';
import AppScreen from '../components/AppScreen';
import Entypo from 'react-native-vector-icons/Entypo';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const ConnectionsScreen = () => {
  const { connections, setConnections } = useConnectionStore();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  useFocusEffect(
    useCallback(() => {
      fetchConnections();
    }, []),
  );

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await getReceivedConnections();
      setConnections(res);
    } catch {}
    setLoading(false);
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          // navigation.nav
          navigation.navigate('ChatScreen', {
            userId: item._id,
            name: `${item.firstName} ${item.lastName}`,
            photoUrl: item.photoUrl,
          })
        }
      >
        {item?.photoUrl ? (
          <Image source={{ uri: item.photoUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.fallback]}>
            <Entypo name="user" size={30} color="#777" />
          </View>
        )}
        <View>
          <Text style={styles.name}>
            {item?.firstName} {item?.lastName}
          </Text>
          <Text style={styles.message}>Tap to start chat</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AppScreen>
      <View style={styles.container}>
        <Text style={styles.header}>Your Connections</Text>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={connections}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ gap: 12 }}
          />
        )}
      </View>
    </AppScreen>
  );
};

export default ConnectionsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    gap: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  message: {
    fontSize: 12,
    color: '#555',
  },
});
