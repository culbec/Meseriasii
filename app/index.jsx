import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase_db } from '../firebaseConfig';
import { getDocs, collection, getDoc, doc } from 'firebase/firestore';
import { service } from './service/service';  // Import the service instance

const HomePage = () => {
  const navigation = useNavigation();  // Initialize navigation
  const [categories, setCategories] = useState([]);
  const [meseriasi, setMeseriasi] = useState([]);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const categoriesData = await service.getCategories();
        console.log("Fetched categories:", categoriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    const fetchMeseriasiWithOffers = async () => {
      try {
        // Fetching meseriasi data directly
        const meseriasiData = await service.getMeseriasi();
        console.log("Fetched meseriasi data:", meseriasiData);
    
        if (Array.isArray(meseriasiData)) {
          // Now, properly handle each meserias's offers
          const meseriasiWithOffers = await Promise.all(meseriasiData.map(async (meserias) => {
            const userRef = meserias.user;
            if (userRef) {
              const userSnapshot = await getDoc(userRef);
              if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                meserias.user = [{ first_name: userData.first_name, last_name: userData.last_name }];
              } else {
                console.log(`User not found for meserias with ID: ${meserias.id}`);
              }
            }
            
            // Fetch offers for this meserias
            const offersForMeseriasData = await service.getMeseriasOffers(meserias.id);
            meserias.offers = offersForMeseriasData;
            
            console.log(meserias.offers);
            // Log each offer in the requested format
            meserias.offers.forEach((offer) => {
              console.log(`Meserias: ${meserias.user[0].first_name} ${meserias.user[0].last_name}, Offer Description: ${offer.description}, Price: ${offer.start_price} lei`);
            });
    
            return meserias;
          }));
    
          setMeseriasi(meseriasiWithOffers);
        } else {
          console.error("Fetched meseriasi data is not an array.");
        }
      } catch (error) {
        console.error("Error fetching meseriasi data: ", error);
      }
    };

    fetchCategories();
    fetchMeseriasiWithOffers();
  }, []); 

  const truncateText = (text, maxLength = 70) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Meseriasii</Text>
        {/* Profile picture button */}
        <TouchableOpacity 
          style={styles.profilePicture}
          onPress={() => navigation.navigate('Login')}  // Navigate to Login screen
        >
          <Text style={styles.profileText}>P</Text>
        </TouchableOpacity>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <Text style={styles.slogan}>Slogan...ceva emotionant</Text>
        <TextInput style={styles.searchBar} placeholder="Search..." />
      </View>

      {/* Category Bar */}
      <View style={styles.categorySection}>
        {/* Category Bar */}
        <ScrollView horizontal style={styles.categoryBar} showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <View key={category.id} style={styles.category}>
              <Text style={styles.categoryText}>{category.Name}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.scrollButton}>
            <Text style={styles.scrollButtonText}>→</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Offers Meseriasi Section */}
      <View style={styles.offersMeseriasi}>
        <Text style={styles.sectionTitle}>Oferte:</Text>
        {meseriasi.map((meserias, index) =>
          meserias.offers.map((offer, offerIndex) => (
            <TouchableOpacity
              key={`${meserias.id}-${offerIndex}`} // meseriasID -> meserias.id
              style={styles.meseriasCard}
              onPress={() =>
                navigation.navigate('OfferDetailScreen', { 
                  "meseriasID": meserias.id, 
                  offerIndex 
                })
              }
            >
              <Text style={styles.meseriasName}>
                {meserias.user?.[0]?.first_name || 'Unknown Meserias'} {meserias.user?.[0]?.last_name || ''}
              </Text>
              <Text style={styles.offerText}>
                {truncateText(offer.description || 'No description available')}
              </Text>
              <Text style={styles.startPrice}>de la {offer.start_price} lei</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.contactInfo}>
          <Text>Email: example@example.com</Text>
          <Text>Phone: +123456789</Text>
        </View>
        <Text style={styles.footerLogo}>Placeholder Logo</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    paddingBottom: 100, // Prevents cutting off footer
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    fontSize: 18,
    color: '#777',
  },
  searchSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  searchBar: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  slogan: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
    color: '#777',
  },
  categorySection: {
    height: 140,
  },
  categoryBar: {
    height: 10,
    flexDirection: 'row',
    paddingVertical: 10,
  },
  category: {
    width: 120,
    height: 120,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    marginRight: 10,
  },
  scrollButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  scrollButtonText: {
    fontSize: 18,
  },
  offersMeseriasi: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  meseriasCard: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    position: 'relative',
  },
  meseriasName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  offerText: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  startPrice: {
    position: 'absolute',
    top: 15,
    right: 1,
    fontSize: 12,
    color: '#555',
  },
  footer: {
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    paddingTop: 10,
    alignItems: 'center',
  },
  contactInfo: {
    alignItems: 'center',
    fontSize: 12,
    color: '#777',
  },
  footerLogo: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
  },
});

export default HomePage;
