import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import AppScreen from '../components/AppScreen';

const ChatScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { name, photoUrl } = route.params;

  return (
    <AppScreen>
      <View style={{flex:1}}>
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

        <View style={styles.chatBox}>
          <Text style={{ color: '#aaa' }}>[Chat messages here]</Text>
        </View>
      </View>
    </AppScreen>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
