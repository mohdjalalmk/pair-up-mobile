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
import Icon from 'react-native-vector-icons/Entypo';
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

  const renderTextOrInput = (
    label: string,
    value: string,
    onChange: (val: string) => void,
    isNumeric = false,
  ) => {
    return (
      <View style={styles.row}>
        <Text style={styles.label}>{label}:</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={value}
            keyboardType={isNumeric ? 'numeric' : 'default'}
            onChangeText={onChange}
          />
        ) : (
          <View style={styles.displayBox}>
            <Text style={styles.displayText}>{value}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <AppScreen>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profile}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Icon name="dots-three-vertical" size={24} />
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
        {renderTextOrInput('First Name', user.firstName, text =>
          setUser({ ...user, firstName: text }),
        )}
        {renderTextOrInput('Last Name', user.lastName, text =>
          setUser({ ...user, lastName: text }),
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <View style={styles.displayBox}>
            <Text style={styles.displayText}>{user.email}</Text>
          </View>
        </View>
        {renderTextOrInput(
          'Age',
          String(user.age),
          text => setUser({ ...user, age: parseInt(text) }),
          true,
        )}
        {renderTextOrInput('Gender', user.gender, text =>
          setUser({ ...user, gender: text }),
        )}
        {renderTextOrInput('Description', user.description, text =>
          setUser({ ...user, description: text }),
        )}
        {renderTextOrInput('Skills', user.skills.join(', '), text =>
          setUser({ ...user, skills: text.split(',').map(s => s.trim()) }),
        )}

        {editing && <Button title="Save Changes" onPress={handleSave} />}
      </ScrollView>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profile:{
    backgroundColor:"#798c86",
    padding:5,
    borderRadius:10
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
  displayBox: {
    backgroundColor: '#c5d6d1',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    minHeight: 42,
    justifyContent: 'center',
  },
  displayText: {
    fontSize: 16,
    color: '#333',
  },
});
