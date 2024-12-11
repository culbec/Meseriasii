import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from '../service/ApiService'; // Importă ApiService
const { width } = Dimensions.get('window');

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]  = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress]  = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!username || !firstName || !lastName || !phoneNumber || !address || !password) {
      Alert.alert('Eroare', 'Te rugăm să completezi toate câmpurile.');
     
      return;
    }

    const user = {
      username: username,
      type: 'meserias',
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      address: address,
      date: new Date().toUTCString(),
      version: 1
    };

    try {
      const token = await ApiService.register(user, password);

      Alert.alert('Înregistrare reușită', `Bun venit, ${firstName}!`);
      navigation.navigate('index');
    } catch (error) {
      console.error('Eroare la înregistrare:', error);
      if (error.response && error.response.data && error.response.data.message) {
        Alert.alert('Eroare', error.response.data.message);
      } else {
        Alert.alert('Eroare', 'A apărut o eroare la înregistrare. Încearcă din nou.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Creează un cont</Text>

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
          placeholder="Prenume"
          placeholderTextColor="#888"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Nume"
          placeholderTextColor="#888"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Număr de telefon"
          placeholderTextColor="#888"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Adresă"
          placeholderTextColor="#888"
          value={address}
          onChangeText={setAddress}
          autoCapitalize="words"
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

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Înregistrează-te</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('index')} style={{ marginTop: 15 }}>
        <Text style={styles.linkText}>Ai deja un cont? <Text style={{ fontWeight: 'bold' }}>Conectează-te</Text></Text>

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
  linkText: {
    color: '#007AFF',
    fontSize: 16,
    textAlign: 'center'
  }
});

export default RegisterScreen;
