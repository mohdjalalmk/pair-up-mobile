import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import AppScreen from '../components/AppScreen';
import { useAuthStore } from '../store/authStore';
import Keychain from 'react-native-keychain';
import { removeToken } from '../utils/auth';
import api from '../api/axiosInstance';
import { deleteAccount, logout } from '../services/authServices';
import { User, useUserStore } from '../store/userStore';
import { updateProfile, viewProfile } from '../services/userService';
import Toast from 'react-native-toast-message';
import { ALLOWED_EDIT_FIELDS } from '../constants/constants';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = () => {
  const storeUser = useUserStore(state => state.user);
  console.log(storeUser, ':::store user');

  const [user, setUser] = useState<User>(storeUser);
  const [editing, setEditing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null); // holds file data

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await viewProfile();
      setUser(profileData);
    } catch (error) {
      if (error instanceof Error) {
        Toast.show({
          type: 'error',
          text1: 'Failed to fetch details',
          text2: error.message,
          position: 'bottom',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    await removeToken();
    useAuthStore.getState().logout();
  };

  const handleDelete = async () => {
    await deleteAccount();

    Toast.show({
      type: 'info',
      text1: 'Account deleted',
    });
    await removeToken();
    useAuthStore.getState().logout();
  };

  const handleImagePick = async () => {
    if (!editing) return;
    console.log('here');

    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (result.didCancel || result.errorCode) return;

    const asset = result.assets?.[0];
    if (asset?.uri) {
      setSelectedImage({
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || 'profile.jpg',
      });
      setUser({ ...user, photoUrl: asset.uri });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      // Append editable user fields
      ALLOWED_EDIT_FIELDS.forEach(key => {
        const value = (user as any)[key];
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      // Append image file under '/image' if selected
      if (selectedImage) {
        formData.append('photo', selectedImage);
      }
      console.log('formdat:', JSON.stringify(formData));

      await updateProfile(formData);

      Toast.show({ type: 'success', text1: 'Profile updated' });
      setEditing(false);
    } catch (error) {
      if (error instanceof Error) {
        Toast.show({
          type: 'error',
          text1: 'Update failed',
          text2: error.message,
          position: 'bottom',
        });
      }
    } finally {
      setLoading(false);
    }
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

  const FormContent = () => {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        {renderTextOrInput('First Name', user?.firstName, text =>
          setUser({ ...user, firstName: text }),
        )}
        {renderTextOrInput('Last Name', user?.lastName, text =>
          setUser({ ...user, lastName: text }),
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <View style={styles.displayBox}>
            <Text style={styles.displayText}>{user?.email}</Text>
          </View>
        </View>
        {renderTextOrInput(
          'Age',
          String(user?.age),
          text => setUser({ ...user, age: parseInt(text) }),
          true,
        )}
        {renderTextOrInput('Gender', user?.gender, text =>
          setUser({ ...user, gender: text }),
        )}
        {renderTextOrInput('Description', user?.description, text =>
          setUser({ ...user, description: text }),
        )}
        {renderTextOrInput('Skills', user?.skills.join(', '), text =>
          setUser({ ...user, skills: text.split(',').map(s => s.trim()) }),
        )}

        {editing && <Button title="Save Changes" onPress={handleSave} />}
      </ScrollView>
    );
  };

  const ProfileMenu = () => {
    return (
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            setEditing(true);
            setMenuVisible(false);
          }}
        >
          <Icon name="edit" size={18} style={styles.menuIcon} />
          <Text style={styles.menuText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            setMenuVisible(false);
            handleLogout();
          }}
        >
          <Icon name="log-out" size={18} style={styles.menuIcon} />
          <Text style={styles.menuText}>Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            setMenuVisible(false);
            handleDelete();
          }}
        >
          <Icon
            name="trash"
            size={18}
            style={[styles.menuIcon, { color: 'red' }]}
          />
          <Text style={[styles.menuText, { color: 'red' }]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const ProfilePhoto = () => {
    return (
      <TouchableOpacity disabled={!editing} onPress={handleImagePick}>
        {user?.photoUrl ? (
          <View style={styles.photo}>
            <Image source={{ uri: user.photoUrl }} style={styles.profileIcon} />
          </View>
        ) : (
          <View style={styles.center}>
            <Icon size={100} name={'user'} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const ProfileHeader = () => {
    return (
      <View style={styles.header}>
        <View/>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Icon name="dots-three-vertical" size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  const LoadingIndicator = () => {
    if (loading) {
      return (
          <ActivityIndicator size="large" />
      );
    }
  };

  return (
    <AppScreen>
      {/* Header */}
      {ProfileHeader()}
      {ProfilePhoto()}
      {LoadingIndicator()}

      {/* 3-dot Menu */}
      {menuVisible && ProfileMenu()}
      {FormContent()}
    </AppScreen>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  menu: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    position: 'absolute',
    right: 16,
    top: 60,
    elevation: 5, // Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 100,
    minWidth: 180,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuIcon: {
    marginRight: 10,
    color: '#444',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
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
  photo: { alignItems: 'center', marginTop: 10 },
  profileIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#798c86',
  },
  center: { justifyContent: 'center', alignItems: 'center' },
});
