import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import AppScreen from '../components/AppScreen';
import { createSocketConnection } from '../services/socket';
import { useUserStore } from '../store/userStore';

const ChatScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { name, photoUrl, userId } = route.params;
  const storeUser = useUserStore(state => state.user);
  const socketRef = useRef<any>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  const user = storeUser;

  useEffect(() => {
    if (!user?._id) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('joinChat', {
        toUserId: userId,
        fromUserId: user._id,
      });
    });

    socket.on('receiveMessage', messageData => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: messageData.message,
          fromUserId: messageData.fromUserId,
        },
      ]);
    });

    socket.on('connect_error', err => {
      //handle error
      console.error('❌ Socket connection error:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, user?._id]);

  const handleSend = () => {
    if (!input.trim()) return;

    const messageObj = {
      fromUserId: user._id,
      toUserId: userId,
      message: input,
    };

    socketRef.current?.emit('sendMessage', messageObj);

    setInput('');
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.fromUserId === user._id;

    return (
      <View
        style={[styles.messageContainer, isMe ? styles.sent : styles.received]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <AppScreen>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name="chevron-left" size={28} color="#333" />
          </TouchableOpacity>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.fallback]}>
              <Entypo name="user" size={30} color="#777" />
            </View>
          )}
          <Text style={styles.name}>{name}</Text>
        </View>

        {/* Messages */}
        <FlatList
          data={[...messages].reverse()}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatBox}
          inverted
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message"
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Entypo name="paper-plane" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </AppScreen>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 12,
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatBox: {
    padding: 20,
    gap: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#eee',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  sent: {
    backgroundColor: '#0078fe',
    alignSelf: 'flex-end',
  },
  received: {
    backgroundColor: '#ccc',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 25,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#0078fe',
    padding: 12,
    borderRadius: 25,
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
