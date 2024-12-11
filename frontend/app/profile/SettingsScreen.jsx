import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();

  const [address, setAddress] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // State pentru modalul de schimbare a parolei
  const [modalVisible, setModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveChanges = () => {
    // Validare parolei
    if (newPassword !== confirmPassword) {
      Alert.alert('Eroare', 'Parolele nu se potrivesc!');
      return;
    }

    // Aici ar trebui să implementezi logica de validare a parolei vechi (de exemplu, un apel la backend)
    
    // Dacă totul este în regulă, poți salva modificările
    Alert.alert('Succes', 'Datele au fost actualizate cu succes!');
    setModalVisible(false); // Închide modalul
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setări</Text>

      <TextInput
        style={styles.input}
        placeholder="Nume"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Prenume"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Adresă"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Număr de telefon"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <Button
        title="Schimbă parola"
        onPress={() => setModalVisible(true)}
        color="#FF6347"
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Schimbă parola</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Parola veche"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Parola nouă"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmă parola nouă"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <View style={styles.modalButtons}>
              <Button title="Anulează" onPress={() => setModalVisible(false)} />
              <Button title="Salvează" onPress={handleSaveChanges} />
            </View>
          </View>
        </View>
      </Modal>

      <Button title="Salvează modificările" onPress={() => Alert.alert('Modificările au fost salvate!')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  changePasswordButton: {
    backgroundColor: '#FF6347', // Roșu tomat
    color: 'white',
    padding: 10,
    borderRadius: 5,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
