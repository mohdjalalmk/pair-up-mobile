import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppScreen from '../components/AppScreen';
import { useAuthStore } from '../store/authStore';
import Keychain from 'react-native-keychain';

const mockUser = {
  firstName: 'Jalal',
  lastName: 'Mohammed',
  age: 25,
  email: 'jalal@example.com',
  gender: 'male',
  photoUrl: 'https://via.placeholder.com/150',
  description: 'Whatsapp devs!',
  skills: ['React Native', 'Node.js', 'MongoDB'],
};

const ProfileScreen = () => {
  const [user, setUser] = useState(mockUser);
  const [editing, setEditing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

   const handleLogout = async () => {
    await Keychain.resetGenericPassword();
    useAuthStore.getState().logout();
  };

  const handleDelete = () => {
    Alert.alert('Delete Account', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: () => Alert.alert('Account deleted') },
    ]);
  };

  const handleSave = () => {
    setEditing(false);
    Alert.alert('Profile updated');
    // send updated data to backend here
  };

  return (
    <AppScreen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
            <Icon name="dots-vertical" size={24} />
          </TouchableOpacity>
        </View>

        {/* 3-dot Menu */}
        {menuVisible && (
          <View style={styles.menu}>
            <TouchableOpacity
              onPress={() => {
                setEditing(true);
                setMenuVisible(false);
              }}
            >
              <Text>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                handleLogout();
              }}
            >
              <Text>Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                handleDelete();
              }}
            >
              <Text style={{ color: 'red' }}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.row}>
            <Text style={styles.label}>First Name:</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={user.firstName}
                onChangeText={text => setUser({ ...user, firstName: text })}
              />
            ) : (
              <Text>{user.firstName}</Text>
            )}
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Last Name:</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={user.lastName}
                onChangeText={text => setUser({ ...user, lastName: text })}
              />
            ) : (
              <Text>{user.lastName}</Text>
            )}
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text>{user.email}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Age:</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(user.age)}
                onChangeText={text => setUser({ ...user, age: parseInt(text) })}
              />
            ) : (
              <Text>{user.age}</Text>
            )}
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Gender:</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={user.gender}
                onChangeText={text => setUser({ ...user, gender: text })}
              />
            ) : (
              <Text>{user.gender}</Text>
            )}
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Description:</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={user.description}
                onChangeText={text => setUser({ ...user, description: text })}
              />
            ) : (
              <Text>{user.description}</Text>
            )}
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Skills:</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={user.skills.join(', ')}
                onChangeText={text =>
                  setUser({
                    ...user,
                    skills: text.split(',').map(s => s.trim()),
                  })
                }
              />
            ) : (
              <Text>{user.skills.join(', ')}</Text>
            )}
          </View>

          {editing && <Button title="Save Changes" onPress={handleSave} />}
        </ScrollView>
      </View>
    </AppScreen>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  menu: {
    backgroundColor: 'white',
    padding: 10,
    elevation: 2,
    position: 'absolute',
    right: 10,
    top: 50,
    borderRadius: 6,
    zIndex: 10,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  row: {
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
  },
});
