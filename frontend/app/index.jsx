import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from './service/ApiService'; 
const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Eroare', 'Te rugăm să introduci username și parola.');
      return;
    }

    try {
      const user = await ApiService.login(username, password);
      console.log("ApiService User:", user);

      navigation.navigate('HomePage', { user });
    } catch (error) {
      console.error("Eroare la autentificare:", error);
      if (error.response && error.response.data && error.response.data.message) {
        Alert.alert('Eroare', error.response.data.message);
      } else {
        Alert.alert('Eroare', 'A apărut o problemă la autentificare. Încearcă din nou.');
      }
    }
  };

  const handleRegister = async () => {
    navigation.navigate("auth/Register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Autentificare</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Parolă"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      
      <TouchableOpacity style={[styles.button, { marginBottom: 15 }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Autentifică-te</Text>
      </TouchableOpacity>



      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5ECF4',
    padding: 20,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#ffffffcc',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: '90%', 
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
