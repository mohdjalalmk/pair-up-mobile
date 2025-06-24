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

const { width } = Dimensions.get('window');

const ReceivedRequestsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const { requests, setRequests, removeRequest } = useRequestStore();
  console.log('selectedUser', selectedUser);

  console.log(requests, 'requests');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getReceivedRequests();
      setRequests(res);
    } catch {
      // Error already handled via Toast in service
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await api.post(`/request/accept/${id}`);
      Toast.show({ type: 'success', text1: 'Request accepted' });
      fetchRequests();
      setSelectedUser(null);
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to accept request' });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.post(`/request/reject/${id}`);
      Toast.show({ type: 'info', text1: 'Request rejected' });
      fetchRequests();
      setSelectedUser(null);
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to reject request' });
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const user = item?.fromUserId;

    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => setSelectedUser(user)}
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

        <Modal visible={!!selectedUser} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.card}>
              <Image
                source={{
                  uri:
                    selectedUser?.photoUrl || 'https://via.placeholder.com/150',
                }}
                style={styles.cardImageLarge}
              />
              <Text style={styles.cardTitle}>
                {selectedUser?.firstName} {selectedUser?.lastName}
              </Text>
              {selectedUser?.description ? (
                <Text style={styles.cardDescription}>
                  {selectedUser.description}
                </Text>
              ) : null}
              <Text style={styles.cardDetail}>Age: {selectedUser?.age}</Text>
              <Text style={styles.cardDetail}>
                Gender: {selectedUser?.gender}
              </Text>
              <Text style={styles.cardDetail}>
                Skills: {selectedUser?.skills?.join(', ') || 'None'}
              </Text>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  onPress={() => handleAccept(selectedUser._id)}
                  style={styles.acceptBtn}
                >
                  <Text style={styles.btnText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleReject(selectedUser._id)}
                  style={styles.rejectBtn}
                >
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => setSelectedUser(null)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    fontSize: 12,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: width * 0.8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  cardImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  acceptBtn: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 8,
  },
  rejectBtn: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
  },
  btnText: {
    color: 'white',
    fontWeight: '600',
  },
  closeText: {
    marginTop: 12,
    color: '#555',
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    flex: 1,
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
  cardImageLarge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
