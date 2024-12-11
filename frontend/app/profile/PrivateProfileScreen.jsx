import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa FontAwesome pentru simbolurile iconițelor
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider'; // Importa Slider

const PrivateProfileScreen = () => {
  const navigation = useNavigation();

  const userData = {
    id: "5RSOU4BBBbyXCv4a6jub",
    username: "vanessa.b",
    first_name: "Vanessa",
    last_name: "Brenner",
    phone_number: "+40778883211",
    address: "strada 1",
    date: "Tue, 10 Dec 2024 10:12:22 GMT",
    password: "$2a$10$6VFEFGGJY83zEqNTfH44k./M5eHIZJM9CC1.gjxcpYinQ5FWbOmwe",
    type: "user",
    version: 1,
  };

  const image = require('./images/default.png');

  // State pentru modal
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [startPrice, setStartPrice] = useState(100); // Prețul va fi un număr

  const handleSaveDetails = () => {
    // Validare date
    if (!description || !startPrice) {
      alert('Te rog completează toate câmpurile!');
      return;
    }

    // Aici poți salva datele (poate trimite către backend)

    alert('Detaliile au fost salvate!');
    setModalVisible(false); // Închide modalul după salvare
  };

  return (
    <ScrollView contentContainerStyle={styles.outerContainer}>
      <View style={styles.innerContainer}>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('profile/SettingsScreen')}
        >
          <Icon name="cogs" size={30} color="gray" />
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="plus" size={30} color="gray" />
        </TouchableOpacity>

        <Image source={image} style={styles.profileImage} />
        <Text style={styles.name}>{userData.first_name} {userData.last_name}</Text>
        <Text style={styles.username}>@{userData.username}</Text>
        
        <View style={styles.detailRow}>
          <Icon name="phone" size={20} color="gray" />
          <Text style={styles.phone}>{userData.phone_number}</Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="home" size={20} color="gray" />
          <Text style={styles.detail}>{userData.address}</Text>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adaugă detalii</Text>

            <TextInput
              style={styles.descriptionInput}
              placeholder="Descriere"
              value={description}
              onChangeText={setDescription}
              multiline={true}
            />
            <Text style={styles.label}>Preț inițial: {startPrice} RON</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10000}
              step={10}
              value={startPrice}
              onValueChange={(value) => setStartPrice(value)}
            />

            <View style={styles.modalButtons}>
              <Button title="Anulează" onPress={() => setModalVisible(false)} />
              <Button title="Salvează" onPress={handleSaveDetails} />
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#CED1FA', // Fundalul colorat pe toată pagina
    padding: 10,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: 'white', // Fundalul conținutului interior
    borderRadius: 15, // Colțuri rotunjite ale conținutului
    marginHorizontal: 10, // Spațiu pe margini
    paddingVertical: 20, // Spațiu pe verticală
    alignItems: 'center',
    position: 'relative', // Poziționare relativă pentru a plasa iconița în colțul din dreapta sus
  },
  settingsButton: {
    position: 'absolute', // Poziționăm iconița în colțul din dreapta sus al innerContainer
    top: 20,
    right: 20,
    zIndex: 1, // Asigură-te că iconița va fi deasupra altor elemente
  },
  addButton: {
    position: 'absolute', // Poziționăm iconița "+" în colțul din stânga sus
    top: 20,
    left: 20,
    backgroundColor: 'transparent', // Fără fundal colorat, ca butonul de settings
    borderRadius: 50, // Colțuri rotunjite pentru buton
    padding: 10,
    zIndex: 1,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  phone: {
    fontSize: 16,
    marginBottom: 15,
  },
  detail: {
    fontSize: 14,
    marginBottom: 5,
  },
  detailRow: {
    flexDirection: 'row', // Alignăm iconița și textul pe orizontală
    alignItems: 'center', // Aliniem iconița cu textul
    marginBottom: 10, // Spațiu între fiecare rând
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
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
  descriptionInput: {
    height: 200, // Mărim înălțimea pentru caseta de descriere
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
    textAlignVertical: 'top',  // Textul se aliniază sus
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
});

export default PrivateProfileScreen;
