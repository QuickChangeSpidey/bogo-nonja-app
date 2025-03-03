import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

// Sample data for restaurants
import fastFood from '../data/fastFood.json';
import chinese from '../data/chinese.json';
import indian from '../data/indian.json';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const allRestaurants = [...fastFood, ...chinese, ...indian]; // Combine all restaurants

// Filter only favorited restaurants
const favorites = allRestaurants.filter(restaurant => restaurant.isFavorite);

const FavoritesScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFavorites, setFilteredFavorites] = useState(favorites);

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredFavorites(favorites); // Reset to all favorites if query is empty
    } else {
      const lowercasedQuery = query.toLowerCase();
      const filtered = favorites.filter(
        restaurant =>
          restaurant.name.toLowerCase().includes(lowercasedQuery) ||
          (restaurant.name &&
            restaurant.name.toLowerCase().includes(lowercasedQuery)),
      );
      setFilteredFavorites(filtered);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TouchableOpacity>
          <Icon
            name="magnifying-glass"
            size={24}
            color="#666"
            style={styles.searchIcon}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Search by name"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Display filtered favorites */}
      <FlatList
        data={filteredFavorites}
        keyExtractor={item => item.id + item.name}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RestaurantDetails')}>
            <Image source={{uri: item.image}} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.hours}</Text>
              {item.coupons > 0 && (
                <Text style={styles.couponText}>
                  {item.coupons} Coupons Available
                </Text>
              )}
            </View>
            <TouchableOpacity style={styles.favoriteIcon}>
              <Icon name="heart" size={20} color="#28a745" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No restaurants found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
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
  favoriteIcon: {
    padding: 10,
  },
  noFavoritesText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
});

export default FavoritesScreen;
