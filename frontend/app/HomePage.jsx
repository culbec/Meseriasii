import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from './service/ApiService';
import { useRoute } from '@react-navigation/native';

const HomePage = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);

  const route = useRoute();
  const user = route.params.user;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await ApiService.getCategories();
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
        const offersData = await ApiService.getOffers();
        setOffers(offersData);
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
          const offersData = await ApiService.getOffersByCategory(selectedCategory.Name);
          setOffers(offersData);
        } catch (err) {
          console.error("Error fetching offers: ", err);
        }
      } else {
        const offersData = await ApiService.getOffers();
        setOffers(offersData);
      }
    };
    fetchOffersForCategory();
  }, [selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const truncateText = (text, maxLength = 150) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>Meseriasii</Text>
          <TouchableOpacity
              style={styles.profilePicture}
              onPress={() => navigation.navigate('profile/PrivateProfileScreen', { user })}
          >
            <Text style={styles.profileText}>P</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchSection}>
          <Text style={styles.slogan}>Profesionisti la un click distanta</Text>
          <TextInput style={styles.searchBar} placeholder="Caută..." />
        </View>

        <ScrollView horizontal style={styles.categorySection} showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
              <TouchableOpacity
                  key={category.id}
                  style={[styles.category, selectedCategory?.id === category.id && styles.selectedCategory]}
                  onPress={() => handleCategorySelect(category)}
              >
                <Text style={styles.categoryText}>{category.Name}</Text>
              </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.offersMeseriasi}>
          <Text style={styles.sectionTitle}>Oferte:</Text>
          {offers.map((offer) => (
              <TouchableOpacity
                  key={offer.id}
                  style={styles.meseriasCard}
                  onPress={() => navigation.navigate('OfferDetailScreen', { selectedOffer: offer })}
              >
                <Text style={styles.offerText}>
                  {truncateText(offer.description || 'Nicio descriere disponibilă')}
                </Text>
                <Text style={styles.categoryText}>{offer.category.name}</Text>
                <Text style={styles.startPrice}>de la {offer.start_price} de lei</Text>
              </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLogo}>Meseriasii</Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Email:</Text>
              <Text style={styles.contactText}>nasii.meseriasii@gmail.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Telefon:</Text>
              <Text style={styles.contactText}>+07 n am cartela</Text>
            </View>
          </View>
          <Text style={styles.footerCopy}>&copy; 2024 Meseriasii. Toate drepturile rezervate.</Text>
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
  selectedCategory: {
    backgroundColor: '#4CAF50',
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
});

export default HomePage