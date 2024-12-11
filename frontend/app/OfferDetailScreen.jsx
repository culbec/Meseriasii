import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

const OfferDetailScreen = () => {
  const route = useRoute();
  const { selectedOffer } = route.params;
  console.log("Selected offer:", selectedOffer)

  const handleCallPress = () => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`).catch(() => {
        Alert.alert('Error', 'Unable to open the dialer.');
      });
    } else {
      Alert.alert('Error', 'Phone number is not available.');
    }
  };

  const category = selectedOffer.category.Name || 'Necunoscut';

  return (
<ScrollView contentContainerStyle={styles.container}>
  <View style={styles.header}>
    <Text style={styles.offerTitle}>
      Oferta de la {`${selectedOffer.meserias.first_name || 'N/A'} ${selectedOffer.meserias.last_name_name || ''}`}
    </Text>
  </View>

  <View style={styles.offerDetail}>
    <Text style={styles.description}>{selectedOffer.description}</Text>
    <View style={styles.priceCategoryContainer}>
      <Text style={styles.startPrice}>Preț: {selectedOffer.start_price} lei</Text>
      <Text style={styles.categoryText}>{selectedOffer.category.Name}</Text>
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
