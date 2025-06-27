import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signupUser } from '../services/authServices';

const SignupScreen = () => {
  const navigation = useNavigation<any>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setError('');
    try {
      const payload = {
        firstName,
        lastName,
        email,
        password,
        age,
        gender,
      };
      const result = await signupUser(payload);
      Alert.alert('Success', 'Account created successfully');
      navigation.goBack();
    } catch (err: any) {
      console.log(JSON.stringify(err));
      setError(err.response?.data);
      Alert.alert('Error', err.response?.data || 'Signup failed');
    }
  };

  const InputContainer = () => {
    return (
      <>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          onChangeText={setFirstName}
          value={firstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          onChangeText={setLastName}
          value={lastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          onChangeText={setAge}
          value={age}
        />
        <TextInput
          style={styles.input}
          placeholder="Gender (male/female)"
          onChangeText={setGender}
          value={gender}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.toggle}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </>
    );
  };

  const AuthButtons = () => {
    return (
      <>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.goBack()}>
            Log In
          </Text>
        </Text>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account 💖</Text>
      {InputContainer()}
      {AuthButtons()}
    </View>
  );
};
export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  passwordInput: { flex: 1, padding: 12 },
  toggle: { paddingHorizontal: 12, color: '#007bff' },
  button: {
    backgroundColor: '#FF5A5F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  bottomText: { marginTop: 20, textAlign: 'center', color: '#444' },
  link: { color: '#FF5A5F', fontWeight: 'bold' },
  error: {
    color: '#A52A2A',
    marginVertical: 10,
  },
});
