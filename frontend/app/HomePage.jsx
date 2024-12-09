import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';  
import { firebase_db } from '../firebaseConfig';  
import { getDocs, collection } from 'firebase/firestore'; 

const HomePage = () => {
  const navigation = useNavigation();  // Initialize navigation
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(firebase_db, 'categories'));
        const documents = snapshot.docs.map(doc => ({
            id: doc.id,  
            ...doc.data() 
          }));
          
          setCategories(documents)
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
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

      {/* Promoted Users Section */}
      <View style={styles.promotedUsers}>
        <Text style={styles.sectionTitle}>Promovati:</Text>
        { /* Placeholder user cards */}
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} style={styles.userCard}>
            <View style={styles.userPhotoPlaceholder}>
              <Text>Photo</Text>
            </View>
            <View style={styles.userRating}>
              <Text style={styles.stars}>★★★★☆</Text>
              <Text style={styles.reviews}>4.25/5 (1241 reviews)</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.contactInfo}>
          <Text>Email: example@example.com</Text>
          <Text>Phone: +123456789</Text>
        </View>
        <Text style={styles.footerLogo}>Placeholder Logo</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
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
  promotedUsers: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  userPhotoPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#eee',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userRating: {
    flex: 1,
    alignItems: 'flex-end',
    paddingLeft: 10,
  },
  stars: {
    color: 'gold',
    fontSize: 16,
  },
  reviews: {
    fontSize: 12,
    color: '#777',
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
