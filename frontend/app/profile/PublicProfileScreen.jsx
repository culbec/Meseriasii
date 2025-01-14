import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa FontAwesome (sau orice alt stil preferi)
import StarRating from 'react-native-star-rating-widget'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import ApiService from '../service/ApiService';

const PublicProfileScreen = () => {
  const route = useRoute();
  const { user } = route.params;

  const userData = {
    id: user.id,
    username: user.username,  
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number,
    address: user.address,        
    date: user.date,
    password: user.password,
    type: "user",
    version: 1,
  };
  
  const [offers, setOffers] = useState([]);

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

  const navigation = useNavigation();

  const image = require('./images/default.png');

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
        <Image source={image} style={styles.profileImage} />
        <Text style={styles.name}>{userData.first_name} {userData.last_name}</Text>
        <View style={styles.starContainer}>
          <StarRating rating={4.23} onChange={() => {}} starSize={30} />
        </View>
        <Text style={styles.username}>@{userData.username}</Text>

        {/* Icon pentru telefon */}
        <View style={styles.detailRow}>
          <Icon name="phone" size={20} color="gray" />
          <Text style={styles.phone}> {userData.phone_number}</Text>
        </View>

        {/* Icon pentru adresă */}
        <View style={styles.detailRow}>
          <Icon name="home" size={20} color="gray" />
          <Text style={styles.detail}> {userData.address}</Text>
        </View>

         <FlatList
            data={offers}
            renderItem={renderOffer}
            keyExtractor={(item) => item.id.toString()}
            style={styles.offersList}
         />
      </View>
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
    flexDirection: 'row',  // Alignăm iconița și textul pe orizontală
    alignItems: 'center',  // Aliniem iconița cu textul
    marginBottom: 10, // Spațiu între fiecare rând
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

export default PublicProfileScreen;
