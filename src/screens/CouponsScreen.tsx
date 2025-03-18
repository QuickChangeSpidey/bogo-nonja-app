import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, FlatList, Text, Image, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

// Import restaurant data
import fastFood from '../data/fastFood.json';
import chinese from '../data/chinese.json';
import indian from '../data/indian.json';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

// Combine all restaurants
const allRestaurants = [...fastFood, ...chinese, ...indian];

type CouponScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Main'
>;

interface CouponScreenProps {
  navigation: CouponScreenNavigationProp;
}

const CouponsScreen: React.FC<CouponScreenProps> = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState(allRestaurants);

  // Function to handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      // Show random restaurants when search is empty
      setFilteredRestaurants(shuffleRestaurants(allRestaurants));
    } else {
      // Filter based on name, genre, or location
      const filtered = allRestaurants.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
          restaurant.hours.toLowerCase().includes(query.toLowerCase()) // Assuming "hours" may represent location or address in the data
      );
      setFilteredRestaurants(filtered);
    }
  };

  // Function to shuffle restaurants for random display
  const shuffleRestaurants = (restaurants: typeof allRestaurants) => {
    return [...restaurants].sort(() => Math.random() - 0.5);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TouchableOpacity>
          <Icon name="magnifying-glass" size={24} color="#666" style={styles.searchIcon} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Search by name or location"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Restaurant List */}
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id + item.name}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={()=>navigation.navigate('CouponDetails')}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.hours}</Text>
              {item.coupons > 0 && (
                <Text style={styles.couponText}>{item.coupons} Coupons Available</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No restaurants found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#28a745',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 5,
    marginBottom: 20,
    backgroundColor: '#fff',
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  locationIcon: {
    marginLeft: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  couponText: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: 'bold',
    marginTop: 5,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
});

export default CouponsScreen;
