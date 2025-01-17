import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
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
  const [reviewAvg, setAvg] = useState([]);
  const [selectedStars, setSelectedStars] = useState(0); // State for selected stars for the review
  const navigation = useNavigation();

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
    const fetchReviewAvg = async () => {
      try {
        const reviewAvg = await ApiService.getAverageReviewForUser(userData.id);
        setAvg(reviewAvg);
      } catch (error) {
        console.error('Error fetching average review:', error);
      }
    };

    fetchReviewAvg();
  }, [userData.id]);

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (selectedStars === 0) {
      alert('Please select a rating!');
      return;
    }

    try {
      await ApiService.submitReview(userData.id, selectedStars, 'Great service!');
      alert('Thank you for your review!');
      setSelectedStars(0); // Reset the stars after submission
    } catch (error) {
      console.error('Error submitting review:', error);
    }

    
    const reviewAvg = await ApiService.getAverageReviewForUser(userData.id);
    setAvg(reviewAvg);
  };

  const renderOffer = ({ item }) => (
    <TouchableOpacity style={styles.offerCard} onPress={() => handleOfferPress(item)}>
      <Text style={styles.offerTitle}>{item.title}</Text>
      <Text style={styles.offerDescription}>
        {item.description.substring(0, 200)}{item.description.length > 100 ? '...' : ''}
      </Text>
      <Text>Pret de la: {item.start_price} RON</Text>
      <Text style={styles.offerCategory}>{item.category.Name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Image source={require('./images/default.png')} style={styles.profileImage} />
        <Text style={styles.name}>{userData.first_name} {userData.last_name}</Text>
        <View style={styles.starContainer}>
          <StarRating rating={reviewAvg} onChange={() => {}} starSize={30} />
        </View>
        <Text style={styles.username}>@{userData.username}</Text>

        <View style={styles.detailRow}>
          <Icon name="phone" size={20} color="gray" />
          <Text style={styles.phone}> {userData.phone_number}</Text>
        </View>

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

        {/* Review Bar (Star Rating to submit review) */}
        <View style={styles.reviewContainer}>
          <Text style={styles.reviewTitle}>Rate the User</Text>
          <StarRating
            rating={selectedStars}
            onChange={(rating) => setSelectedStars(rating)}
            starSize={40}
            style={styles.starRating}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleReviewSubmit}>
            <Text style={styles.submitButtonText}>Submit Review</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    width: '90%',
    alignSelf: 'center',
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
  offerCategory: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  reviewContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    width: '90%',
    alignSelf: 'center',
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  starRating: {
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#2980b9',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PublicProfileScreen;
