import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import DealTypeCarousel from '../components/DealCarousel';

// Sample data for restaurants
import fastFood from '../data/fastFood.json';
import chinese from '../data/chinese.json';
import indian from '../data/indian.json';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import GenresCarousel from '../components/GenresCarousel';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface SearchScreenProps {
  navigation: HomeScreenNavigationProp;
}

const allRestaurants = [...fastFood, ...chinese, ...indian]; // Combine all restaurants
const favorites = allRestaurants.filter(restaurant => restaurant.isFavorite);

const SearchScreen: React.FC<SearchScreenProps> = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFavorites, setFilteredFavorites] = useState(favorites);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredFavorites(favorites);
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
      {/* Deal Type Carousel */}
      <DealTypeCarousel />
      {/* Genres Type Carousel */}
      <GenresCarousel />

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
          placeholder="Search coupons, deals, or restaurants"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
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
    margin: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#28a745',
    borderWidth: 1,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  noFavoritesText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
});

export default SearchScreen;
