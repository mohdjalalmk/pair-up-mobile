import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import AppScreen from '../components/AppScreen';
import api from '../api/axiosInstance';
import Toast from 'react-native-toast-message';
import {
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
} from '../services/requestServices';
import { useRequestStore } from '../store/requestStore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import RequestDetailModal from '../components/RequestDetailModal';

const { width } = Dimensions.get('window');

const ReceivedRequestsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const { requests, setRequests, removeRequest } = useRequestStore();
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);
  
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getReceivedRequests();
      setRequests(res);
    } catch {
      setRequests([]);
      // Error already handled via Toast in service
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      console.log('selectedRequest._id:', selectedRequest._id);

      await acceptRequest(selectedRequest._id);
      fetchRequests();
      setSelectedUser(null);
    } catch {}
  };

  const handleReject = async (id: string) => {
    try {
      await rejectRequest(selectedRequest._id);
      fetchRequests();
      setSelectedUser(null);
    } catch {}
  };

  const renderItem = ({ item }: { item: any }) => {
    const user = item?.fromUserId;

    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => {
          setSelectedRequest(item);
          setSelectedUser(user);
        }}
      >
        {user?.photoUrl ? (
          <Image source={{ uri: user.photoUrl }} style={styles.avatarLarge} />
        ) : (
          <View style={[styles.avatarLarge, styles.avatarFallback]}>
            <Entypo name="user" size={32} color="#777" />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {user?.description || 'No description provided'}
          </Text>
          <Text style={styles.info}>Tap for more details</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AppScreen>
      <View style={styles.container}>
        <Text style={styles.header}>Requests Received</Text>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="users-slash" size={36} />
            <Text style={styles.emptyText}>No requests received yet</Text>
          </View>
        ) : (
          <FlatList
            data={requests}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        )}

        <RequestDetailModal
          visible={!!selectedUser}
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </View>
    </AppScreen>
  );
};

export default ReceivedRequestsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    gap: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    fontSize: 12,
    color: '#555',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 12,
    backgroundColor: '#ddd',
  },
  avatarFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 13,
    color: '#444',
    marginTop: 2,
  },
});
