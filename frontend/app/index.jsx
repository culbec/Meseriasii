import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from './service/ApiService';

meseriasID = "5RSOU4BBBbyXCv4a6jub"
meseriasToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhZHUiLCJpYXQiOjE3MzM4NjY0MzEsImV4cCI6MTczMzg3MDAzMX0.ZUpA3KmlkzgbGWWm5dalOjJ7KR09sdTMH-KP_1Q7t88"


const HomePage = () => {
  const navigation = useNavigation();  // Initialize navigation
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);

  ApiService.setToken(meseriasToken)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await ApiService.getCategories()
        setCategories(categoriesData);
      } catch (err) { 
        console.error("Error fetching categories: ", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offersData = await ApiService.getOffersByMeseriasId(meseriasID);  // Adjust this if needed to get all offers
        console.log("Fetched offers:", offersData);
        setOffers(offersData);  // Update the state with fetched offers
      } catch (error) {
        console.error("Error fetching offers: ", error);
      }
    };
    fetchOffers();
  }, []);

  useEffect(() => {
    const fetchOffersForCategory = async () => {
      if (selectedCategory) {
        try {
          const offersData = await ApiService.getOffersByCategory(selectedCategory.Name);  // Assume ApiService has this method
          // console.log("Fetched offers for category:", offersData);
          setOffers(offersData);
        } catch (err) {
          console.error("Error fetching offers: ", err);
        }
      }
    };
 
    fetchOffersForCategory();
  }, [selectedCategory]);  // Run this effect when selectedCategory changes

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);  // Set selected category to trigger fetching offers
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.logo}>Meseriasii</Text>
        <TouchableOpacity 
          style={styles.profilePicture} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.profileText}>P</Text>
        </TouchableOpacity>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <Text style={styles.slogan}>Profesionisti la un click distanta</Text>
        <TextInput style={styles.searchBar} placeholder="Search..." />
      </View>

      {/* Category Bar */}
      <ScrollView horizontal style={styles.categorySection} showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          // <View key={category.id} style={styles.category}>
          //   <Text style={styles.categoryText}>{category.Name}</Text>
          // </View>
          <TouchableOpacity 
            key={category.id} 
            style={[styles.category, selectedCategory?.id === category.id && styles.selectedCategory]} 
            onPress={() => handleCategorySelect(category)}
          >
            <Text style={styles.categoryText}>{category.Name}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.scrollButton}>
          <Text style={styles.scrollButtonText}>→</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Offers Section */}
      <View style={styles.offersMeseriasi}>
        <Text style={styles.sectionTitle}>Oferte:</Text>
        {offers.map((offer, index) => (
          <TouchableOpacity
            key={offer.id} // Unique key for each offer
            style={styles.meseriasCard}
            onPress={() => navigation.navigate('OfferDetailScreen', {
              offerId: offer.id,  // Pass offer ID for detailed view
            })}
          >
            <Text style={styles.offerText}>
              {truncateText(offer.description || 'No description available')}
            </Text>
            <Text style={styles.categoryText}>
              {offer.category.name} {/* Display category */}
            </Text>
            <Text style={styles.startPrice}>de la {offer.start_price} de lei</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerLogo}>Meseriasii</Text>
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Email:</Text>
            <Text style={styles.contactText}>nasii.meseriasii@gmail.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Phone:</Text>
            <Text style={styles.contactText}>+07 n am cartela</Text>
          </View>
        </View>
        <Text style={styles.footerCopy}>&copy; 2024 Meseriasii. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4a90e2',
    borderBottomWidth: 1,
    borderBottomColor: '#d4d4d4',
    elevation: 2,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e2e2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 16,
    color: '#4a90e2',
  },
  searchSection: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  slogan: {
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#222',
    marginBottom: 12,
    textAlign: 'center',
  },
  searchBar: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    fontSize: 16,
  },
  categorySection: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#eaf0f9',
  },
  category: {
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#4a90e2',
    borderRadius: 20,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 16,
  },
  scrollButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  scrollButtonText: {
    fontSize: 16,
    color: '#4a90e2',
  },
  offersMeseriasi: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#4a90e2',
    marginBottom: 12,
  },
  meseriasCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  meseriasName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
  },
  offerText: {
    fontSize: 16,
    color: '#666666',
    marginVertical: 8,
  },
  startPrice: {
    fontSize: 16,
    color: '#4a90e2',
  },
  footer: {
    paddingVertical: 20,
    backgroundColor: '#4a90e2',
    borderTopWidth: 1,
    borderTopColor: '#d4d4d4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  contactInfo: {
    marginBottom: 16,
    width: '80%',
    alignItems: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  contactLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    marginRight: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#f0f0f0',
  },
  footerCopy: {
    fontSize: 14,
    color: '#cccccc',
    marginTop: 8,
  },
  selectedCategory: {
    backgroundColor: '#4CAF50', // Culoare verde pentru selecția categoriei
  },
});

export default HomePage;
