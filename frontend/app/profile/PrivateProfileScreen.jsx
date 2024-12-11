import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, Modal, Button, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import ApiService from '../service/ApiService';

const PrivateProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userData = route.params.user;
  console.log("PrivateProfileScreen User:", userData);

  const image = require('./images/default.png');
  
  const [categories, setCategories] = useState([]); // State pentru categoriile disponibile
  const [selectedCategory, setSelectedCategory] = useState(null); // Categorie aleasă

  const [modalVisible, setModalVisible] = useState(false);
  const [offerModalVisible, setOfferModalVisible] = useState(false);  // State pentru modalul ofertei
  const [description, setDescription] = useState('');
  const [startPrice, setStartPrice] = useState(100);
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);  // State pentru oferta selectată

  // Funcția pentru a obține ofertele utilizatorului
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const userOffers = await ApiService.getOffersByMeseriasId(userData.id);
        console.log("Offers", userOffers);
        setOffers(userOffers);
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
  }, [userData.id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesList = await ApiService.getCategories(); // API pentru categoriile disponibile
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchCategories();
  }, []);


  const handleSaveDetails = async () => {
    if (!description || !startPrice || !selectedCategory) {
      alert('Te rog completează toate câmpurile!');
      return;
    }
  
    // Creează oferta respectând structura OfferRequest
    const offerRequest = {
      meserias_id: userData.id,  // ID-ul meseriașului
      category_id: selectedCategory,  // ID-ul categoriei selectate
      description,  // Descrierea ofertei
      start_price: startPrice,  // Prețul de start
    };
  
    try {
      // Apelează funcția din ApiService pentru a salva oferta
      await ApiService.addOffer(offerRequest);
  
      // Refă un apel pentru a obține ofertele actualizate
      const userOffers = await ApiService.getOffersByMeseriasId(userData.id);
      setOffers(userOffers); // Actualizează lista de oferte cu cea nouă
  
      alert('Oferta a fost salvată!');
      setModalVisible(false);  // Închide modalul după salvare
    } catch (error) {
      console.error('Error saving offer:', error);
      alert('A apărut o eroare la salvarea ofertei!');
    }
  };
  
  
  

  const handleOfferPress = (offer) => {
    setSelectedCategory(offer.category.id);
    console.log(offer);
    console.log(selectedCategory);
    setSelectedOffer(offer);  // Setează oferta selectată
    setOfferModalVisible(true);  // Deschide modalul pentru ofertă    
  };

  const handleSaveOffer = () => {
    // Aici poți salva modificările ofertei, inclusiv prețul și descrierea
    alert('Oferta a fost salvată!');
    setOfferModalVisible(false);  // Închide modalul
  };

  const renderOffer = ({ item }) => (
    <TouchableOpacity style={styles.offerCard} onPress={() => handleOfferPress(item)}>
    <Text style={styles.offerTitle}>{item.title}</Text>
    <Text style={styles.offerDescription}>
      {item.description.substring(0, 200)}{item.description.length > 100 ? '...' : ''}
    </Text>
    <Text>Pret de la: {item.start_price} RON</Text>
    {/* Adaugă categoria în cardul ofertei */}
    <Text style={styles.offerCategory}>{item.category.Name}</Text>
  </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('profile/SettingsScreen', { userData })}
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

        {/* Afișează ofertele utilizatorului */}
        <FlatList
          data={offers}
          renderItem={renderOffer}
          keyExtractor={(item) => item.id.toString()}
          style={styles.offersList}
        />
      </View>

      {/* Modal pentru crearea unei oferte noi */}
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

            {/* Picker pentru selectarea categoriei */}
            <Text style={styles.label}>Selectează Categorie</Text>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selectează o categorie" value={null} />
              {categories.map((category) => (
                <Picker.Item key={category.id} label={category.Name} value={category.id} />
              ))}
            </Picker>

            <Text style={styles.label}>Preț de la: {startPrice} RON</Text>
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


      {/* Modal pentru vizualizarea și editarea ofertei */}
      <Modal
        visible={offerModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setOfferModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editează Oferta</Text>

            <TextInput
              style={styles.descriptionInput}
              placeholder="Descriere"
              value={selectedOffer?.description || ''}
              onChangeText={(text) => setSelectedOffer({ ...selectedOffer, description: text })}
              multiline={true}
            />
            <Text style={styles.label}>Selectează Categorie</Text>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selectează o categorie" value={null} />
              {categories.map((category) => (
                <Picker.Item key={category.id} label={category.Name} value={category.id} />
              ))}
            </Picker>
            <Text style={styles.label}>Preț de la: {selectedOffer?.start_price} RON</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10000}
              step={10}
              value={selectedOffer?.start_price || 100}
              onValueChange={(value) => setSelectedOffer({ ...selectedOffer, start_price: value })}
            />

            <View style={styles.modalButtons}>
              <Button title="Anulează" onPress={() => setOfferModalVisible(false)} />
              <Button title="Salvează" onPress={handleSaveOffer} />
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
    backgroundColor: '#CED1FA',
    padding: 10,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 10,
    paddingVertical: 20,
    alignItems: 'center',
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  addButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'transparent',
    borderRadius: 50,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  descriptionInput: {
    height: 200,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
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
  offersList: {
    marginTop: 20,
    width: '100%',
  },
  offerCard: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '90%',  // Am redus lățimea cardului pentru a-l face mai îngust
    alignSelf: 'center',  // Centrează cardul pe ecran
  },
  offerTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  offerDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  // Stiluri pentru categoria ofertei
  offerCategory: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
  },  
});

export default PrivateProfileScreen;