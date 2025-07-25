import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import AppScreen from '../components/AppScreen';
import { useAuthStore } from '../store/authStore';
import { removeToken } from '../utils/auth';
import { deleteAccount, logout } from '../services/authServices';
import { User, useUserStore } from '../store/userStore';
import { updateProfile, viewProfile } from '../services/userService';
import Toast from 'react-native-toast-message';
import { ALLOWED_EDIT_FIELDS } from '../constants/constants';
import { launchImageLibrary } from 'react-native-image-picker';
import { createOrder } from '../services/paymentServices';
import RazorpayCheckout from 'react-native-razorpay';

const ProfileScreen = () => {
  const storeUser = useUserStore(state => state.user);
  const [user, setUser] = useState<User>(storeUser);
  const [editing, setEditing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await viewProfile();
      useUserStore.getState().setUser(profileData);

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

  const handlePremiumPurchase = async () => {
    const order = await createOrder();
    const options = {
      description: 'Premium Membership',
      currency: order.cuurency,
      key: order.keyId,
      amount: order.amount,
      name: 'Pair Up',
      order_id: order.id,
      prefill: {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      },
      theme: { color: '#00a86b' },
    };

    RazorpayCheckout.open(options)
      .then(paymentData => {
        Toast.show({ type: 'success', text1: 'Payment Successful' });
      })
      .catch(error => {
        console.log('Payment failed:', error);
        Toast.show({
          type: 'error',
          text1: 'Payment Failed',
          text2: error.description || 'Something went wrong',
        });
      });
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
        <View />
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Icon name="dots-three-vertical" size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  const PremiumInfo = () => {
    if (user?.isPremium) {
      const expiry = new Date(user.premiumExpiry).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      return (
        <View
          style={[
            styles.premiumCard,
            { borderColor: '#ffd700', backgroundColor: '#fffbe6' },
          ]}
        >
          <Text style={[styles.premiumTitle, { color: '#cc9900' }]}>
            🌟 Premium User
          </Text>
          <Text style={styles.premiumDescription}>Valid until: {expiry}</Text>
        </View>
      );
    }
    return (
      <View style={styles.premiumCard}>
        <TouchableOpacity
          onPress={handlePremiumPurchase}
          style={styles.premiumButton}
        >
          <Text style={styles.premiumTitle}>🎉 Go Premium</Text>
          <Text style={styles.premiumDescription}>
            Unlock all features for ₹499
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const LoadingIndicator = () => {
    if (loading) {
      return <ActivityIndicator size="large" />;
    }
  };

  return (
    <AppScreen>
      {/* Header */}
      {ProfileHeader()}
      {ProfilePhoto()}
      {PremiumInfo()}
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
  premiumCard: {
    backgroundColor: '#e9f5f0',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    marginVertical: 10,
    borderColor: '#00a86b',
    borderWidth: 1,
  },
  premiumButton: {
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007f5f',
  },
  premiumDescription: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
});
