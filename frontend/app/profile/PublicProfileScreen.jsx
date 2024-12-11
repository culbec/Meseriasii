import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa FontAwesome (sau orice alt stil preferi)
import { useNavigation } from '@react-navigation/native';

const PublicProfileScreen = () => {

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

  return (
    <ScrollView contentContainerStyle={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Image source={image} style={styles.profileImage} />
        <Text style={styles.name}>{userData.first_name} {userData.last_name}</Text>
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
});

export default PublicProfileScreen;
