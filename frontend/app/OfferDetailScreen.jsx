import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { service } from './service/service';  // Import the service instance
import { getDoc } from "firebase/firestore";  // Add this line
const OfferDetailScreen = () => {
  const [meserias, setMeserias] = useState(null);
  const [offer, setOffer] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const { meseriasID, offerIndex } = route.params;

  const categories = {
    "iVDhwt8x7ZKASzbyXsfz": "Zidarie",
    "pu725EIQeLGsn5sPtDZy": "Electricitate", 
    "v5sE017kJTgjGaAZeT6S": "Constructii",
    "XKps40mYmTGas6tCACLS": "Instalatii sanitare"
  };

  // Fetch meserias data and find offer based on index
  const fetchMeseriasData = async (meseriasID, offerIndex) => {
    console.log(`Starting fetch for meserias data with ID: ${meseriasID} and offer index: ${offerIndex}`);
    
    try {
      // Fetch specific meserias data from the service
      const meseriasData = await service.getMeserias(meseriasID);
      console.log("Fetched meserias data:", meseriasData);
  
      // Check if user data exists
      const userRef = meseriasData.user;
      if (userRef) {
        console.log(`Fetching user details for meserias with ID: ${meseriasID}`);
  
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          console.log(`User data fetched for meserias ID ${meseriasID}:`, userData);
  
          // Update meseriasData user object with phone number and name
          meseriasData.user = [{
            first_name: userData.first_name,
            last_name: userData.last_name,
            phoneNumber: userData.phone_number  // Store phone number in the user object
          }];
  
          // Set the phone number state from user data
          setPhoneNumber(userData.phone_number);
        } else {
          console.warn(`User not found for meserias with ID: ${meseriasID}`);
        }
      } else {
        console.warn(`No user reference found for meserias with ID: ${meseriasID}`);
      }
  
      // Fetch offers for this meserias
      console.log(`Fetching offers for meserias with ID: ${meseriasID}`);
  
      const offersForMeseriasData = await service.getMeseriasOffers(meseriasID);
      meseriasData.offers = offersForMeseriasData;
      console.log(`Offers fetched for meserias ID ${meseriasID}:`, offersForMeseriasData);
  
      // Validate and log specific offer at the given index
      if (Array.isArray(meseriasData.offers) && meseriasData.offers[offerIndex]) {
        const selectedOffer = meseriasData.offers[offerIndex];
        console.log(
          `Selected offer for Meserias (${meseriasData.user[0]?.first_name || 'N/A'} ${meseriasData.user[0]?.last_name || 'N/A'}):`,
          `Description: ${selectedOffer.description}, Price: ${selectedOffer.start_price} lei`
        );
  
        setOffer(selectedOffer);
      } else {
        console.warn(`Offer not found at the specified index (${offerIndex}) for meserias ID: ${meseriasID}`);
      }
  
      // Set the meserias data in state
      setMeserias(meseriasData);
    } catch (error) {
      console.error("Error fetching meserias data:", error);
    } finally {
      console.log("Fetch operation complete, setting loading state to false");
      setLoading(false);
    }
  };
  
  // Usage inside useEffect to fetch a specific meserias and its offer
  useEffect(() => {
    fetchMeseriasData(meseriasID, offerIndex);
  }, [meseriasID, offerIndex]);

  const handleCallPress = () => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`).catch(() => {
        Alert.alert('Error', 'Unable to open the dialer.');
      });
    } else {
      Alert.alert('Error', 'Phone number is not available.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.offerTitle}>Loading...</Text>
      </View>
    );
  }

  if (!offer) {
    return (
      <View style={styles.container}>
        <Text style={styles.offerTitle}>Oferta nu a fost găsită</Text>
      </View>
    );
  }

  const category = categories[offer.category] || 'Necunoscut';

  return (
<ScrollView contentContainerStyle={styles.container}>
  <View style={styles.header}>
    <Text style={styles.offerTitle}>
      Oferta de la {`${meserias?.user[0]?.first_name || 'N/A'} ${meserias?.user[0]?.last_name || ''}`}
    </Text>
  </View>

  <View style={styles.offerDetail}>
    <Text style={styles.description}>{offer.description}</Text>
    <View style={styles.priceCategoryContainer}>
      <Text style={styles.startPrice}>Preț: {offer.start_price} lei</Text>
      {/* <Text style={styles.categoryText}>{category}</Text> */}
    </View>
  </View>

  {/* Butonul de contact, fixat jos */}
  <TouchableOpacity style={styles.callButton} onPress={handleCallPress}>
    <Text style={styles.buttonText}>Contactează</Text>
  </TouchableOpacity>
</ScrollView>


  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80, // Spațiu suplimentar pentru a evita suprapunerea butonului cu conținutul
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  header: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  offerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  offerDetail: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
    lineHeight: 22,
  },
  priceCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  startPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  categoryText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
  callButton: {
    position: 'absolute',      // Poziționează absolut
    bottom: 16,                // La 16 pixeli de marginea de jos a ecranului
    left: 16,                  // La 16 pixeli de marginea din stânga
    right: 16,                 // La 16 pixeli de marginea din dreapta
    paddingVertical: 12,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});

export default OfferDetailScreen;
