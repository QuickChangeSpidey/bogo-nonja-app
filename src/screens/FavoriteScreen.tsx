import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  Modal,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Restaurant = {
  _id: string;
  name: string;
  address: string;
  logo: string;
  couponCount: number;
};

type GenreData = {
  restaurants: Restaurant[];
};

type Data = {
  restaurants: Record<string, GenreData>;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const RestaurantListByGenre: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [data, setData] = useState<Data>({ restaurants: {} });
  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSearchFilterVisible, setIsSearchFilterVisible] = useState(false);
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const GOOGLE_MAPS_API_KEY = 'AIzaSyBxeae0ftXUhPZ8bZWE1-xgaWEkJFKGjek';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need access to your location to show nearby restaurants.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          console.warn('Location permission denied');
        }
      } else {
        getCurrentLocation();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchSearchSuggestions = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: query,
            key: GOOGLE_MAPS_API_KEY,
            types: 'geocode',
            limit: 10,
          },
        },
      );
      if (response.data.status === 'OK') {
        setSearchResults(response.data.predictions);
      } else {
        console.warn('Failed to fetch search suggestions');
      }
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
    }
  };

  const handleSelectSuggestion = async (placeId: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            key: GOOGLE_MAPS_API_KEY,
          },
        },
      );

      if (response.data.status === 'OK') {
        const addressComponents = response.data.result.address_components;
        let city = '';
        let province = '';
        let country = '';
        addressComponents.forEach((component: { types: string[]; long_name: string }) => {
          if (component.types.includes('locality')) {
            city = component.long_name;
          }
          if (component.types.includes('administrative_area_level_1')) {
            province = component.short_name;
          }
          if (component.types.includes('country')) {
            country = component.long_name;
          }
        });

        setCity(city);
        setState(province);
        setCountry(country);
        setIsSearchFilterVisible(false);
      }
    } catch (error) {
      console.error('Error selecting suggestion:', error);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        fetchLocationDetails(latitude, longitude);
      },
      error => {
        console.warn('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 10000,
        distanceFilter: 0,
      },
    );
  };

  const fetchLocationDetails = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === 'OK') {
        // Process the address components to extract city, state, and country
        const addressComponents = data.results[0].address_components;
        const cityObj = addressComponents.find((component:any) =>
          component.types.includes('locality')
        );
        const stateObj = addressComponents.find((component:any) =>
          component.types.includes('administrative_area_level_1')
        );
        const countryObj = addressComponents.find((component:any) =>
          component.types.includes('country')
        );
        fetchRestaurantData(latitude, longitude);
        const city = cityObj ? cityObj.long_name : null;
        const state = stateObj ? stateObj.long_name : null;
        const country = countryObj ? countryObj.long_name : null;
        setCity(city);
        setState(state);
        setCountry(country);

      } else {
        console.warn('Geocoding API error:', data.status);
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
      return null;
    }
  };

  const handleFavorite = (restaurant: Restaurant) => {
    // Implement favorite functionality here
  };

  const fetchRestaurantData = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `http://api.bogoninja.com/api/restaurant-locations/query?lat=${latitude}&long=${longitude}`
      );
      setData(response.data || { restaurants: {} });
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      setData({ restaurants: {} });
    }
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>No restaurants available</Text>
      </SafeAreaView>
    );
  }

  const genres = Object.keys(data);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'flex-end' }}>
        <Text style={styles.countryStateText}>{city}, {state}, {country}</Text>
        <Icon name="location" size={28} color="#28a745" style={{ margin: 10 }} onPress={() => setIsSearchFilterVisible(true)} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {genres.map((genre) => {
          const restaurants: Restaurant[] = data[genre];
          if (!restaurants || restaurants.length === 0) {
            return null;
          }
          return (
            <View key={genre} style={styles.genreSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{genre}</Text>
                <Icon name="chevron-right" size={24} color="#28a745" />
              </View>
              <FlatList
                data={restaurants}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isFavorite = favorites.includes(item._id);
                  return (
                    <TouchableOpacity
                      style={styles.card}
                      onPress={() =>
                        navigation.navigate('CouponsList', {
                          item: {
                            locationId: item._id,
                            locationName: item.name,
                          },
                        })
                      }
                    >
                      <View style={styles.imageContainer}>
                        <Image source={{ uri: item.logo }} style={styles.cardImage} />
                        <TouchableOpacity style={styles.heartIcon} onPress={() => handleFavorite(item)}>
                          <MaterialCommunityIcons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={24}
                            color={isFavorite ? "red" : "#fff"}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <Text style={styles.cardSubtitle}>{item.address}</Text>
                        <Text style={styles.cardCoupon}>
                          {item.couponCount} Coupons Available
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          );
        })}
      </ScrollView>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isSearchFilterVisible}
        onRequestClose={() => setIsSearchFilterVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.filterTitle}>Search</Text>
              <TouchableOpacity onPress={() => setIsSearchFilterVisible(false)}>
                <Icon name="cross" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Set Your Location"
              value={searchQuery}
              onChangeText={text => {
                setSearchQuery(text);
                fetchSearchSuggestions(text);
              }}
            />
            <FlatList
              data={searchResults}
              keyExtractor={item => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e0e0e0',
                    backgroundColor: '#fff',
                  }}
                  onPress={() => handleSelectSuggestion(item.place_id)}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#333',
                      fontWeight: '500',
                    }}>
                    {item.description}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{
                paddingVertical: 8,
              }}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: 1,
                    backgroundColor: '#f0f0f0',
                    marginHorizontal: 16,
                  }}
                />
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  heartIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 6,
    borderRadius: 20,
  },
  container: { flex: 0.9, backgroundColor: '#fff', padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 20,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', textTransform: 'capitalize' },
  genreSection: { marginVertical: 15 },
  card: {
    width: 330,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#28a745',
  },
  searchButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  countryStateText: {
    color: '#28a745',
    fontSize: 12,
    margin: 10,
    fontWeight: 'bold',
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: { padding: 10, backgroundColor: '#fff' },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 12, color: '#555', marginTop: 5 },
  cardCoupon: { fontSize: 12, color: 'green', marginTop: 5 },
  applyButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default RestaurantListByGenre;

