/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  PermissionsAndroid,
  FlatList,
} from 'react-native';
import MapView, {Callout, Marker} from 'react-native-maps';
import Slider from '@react-native-community/slider';
import restaurantData from '../api/restaurants';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import dealTypes from '../api/deals';
import Icon from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';

export interface Restaurant {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  coupons: string[];
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const MapScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>();
  const [isSearchFilterVisible, setIsSearchFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [selectedDealType, setSelectedDealType] = useState<string | null>(null);
  const [distanceRange, setDistanceRange] = useState<number>(5); // Default distance in kilometers
  const [selectedExpiry, setSelectedExpiry] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupRestaurant, setPopupRestaurant] = useState<Restaurant | null>(
    null,
  );
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]); // For location suggestions

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Handle Marker Press
  const handleMarkerPress = (restaurant: Restaurant) => {
    setPopupRestaurant(restaurant);
    setIsPopupVisible(true);
  };

  // Close Popup
  const closePopup = () => {
    setIsPopupVisible(false);
    setPopupRestaurant(null);
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

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need access to your location to show nearby deals.',
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

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setUserLocation({latitude, longitude});
        if (mapRef.current) {
          mapRef.current.animateCamera({
            center: {latitude, longitude},
            zoom: 15,
          });
        }
      },
      error => {
        console.warn('Error getting location:', error);
      },
      {
        enableHighAccuracy: true, // Try GPS first
        timeout: 30000, // Increase timeout to 30 seconds
        maximumAge: 10000, // Allow cached location for 10 seconds
        distanceFilter: 0, // Trigger on every location change
      },
    );
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
        const {lat, lng} = response.data.result.geometry.location;
        mapRef.current?.animateCamera({
          center: {latitude: lat, longitude: lng},
          zoom: 15,
        });
        setIsSearchFilterVisible(false);
      }
    } catch (error) {
      console.error('Error selecting suggestion:', error);
    }
  };

  const mapRef = useRef<MapView>(null); // Create a map reference

  // Add your Google Maps API key here
  const GOOGLE_MAPS_API_KEY = 'AIzaSyBxeae0ftXUhPZ8bZWE1-xgaWEkJFKGjek';

  const handleSearch = async () => {
    if (!searchQuery) {
      console.warn('Please enter a search query');
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: searchQuery,
            key: GOOGLE_MAPS_API_KEY,
          },
        },
      );

      if (response.data.status === 'OK') {
        const {lat, lng} = response.data.results[0].geometry.location;
        // Move the map to the new location
        mapRef.current?.animateCamera({
          center: {
            latitude: lat,
            longitude: lng,
          },
          zoom: 15,
        });

        setIsSearchFilterVisible(false); // Close modal after search
      } else {
        console.warn('Location not found. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Map Section */}
      <MapView
        style={styles.map}
        ref={mapRef}
        initialRegion={{
          latitude: userLocation?.latitude || 49.2827,
          longitude: userLocation?.longitude || -123.1207,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
        {restaurantData.map(restaurant => (
          <Marker
            key={restaurant.id}
            coordinate={{
              latitude: restaurant.latitude,
              longitude: restaurant.longitude,
            }}
            title={restaurant.name}
            onPress={() => {
              setSelectedRestaurant(restaurant);
              if (Platform.OS === 'android') {
                handleMarkerPress(restaurant);
              }
            }}>
            {Platform.OS === 'ios' && <Callout onPress={() => navigation.navigate('CouponDetails')}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{restaurant.name}</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('CouponDetails')}>
                  <Text style={styles.calloutLink}>Show Coupons</Text>
                  <Text style={styles.coupon}>
                    {restaurant.coupons.length} Available
                  </Text>
                </TouchableOpacity>
              </View>
            </Callout>}
          </Marker>
        ))}
      </MapView>
      {/* My location */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => getCurrentLocation()}>
        <Icon name="location" size={24} color="white" />
      </TouchableOpacity>

      {/* Search Button */}
      <TouchableOpacity
        style={styles.filterSearchButton}
        onPress={() => setIsSearchFilterVisible(true)}>
        <Icon name="magnifying-glass" size={24} color="white" />
      </TouchableOpacity>

      {/* Custom Popup Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isPopupVisible}
        onRequestClose={closePopup}>
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            {popupRestaurant && (
              <>
                <Text style={styles.popupTitle}>{popupRestaurant.name}</Text>
                <Text style={styles.popupText}>
                  Coupons Available: {popupRestaurant.coupons.length}
                </Text>
                <TouchableOpacity
                  style={styles.popupButton}
                  onPress={() => {
                    navigation.navigate('CouponDetails');
                    closePopup();
                  }}>
                  <Text style={styles.popupButtonText}>Show Coupons</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.popupCloseButton}
                  onPress={closePopup}>
                  <Text style={styles.popupCloseButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Search Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isSearchFilterVisible}
        onRequestClose={() => setIsSearchFilterVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.filterTitle}>Search</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a restaurant or deal"
              value={searchQuery}
              onChangeText={text => {
                setSearchQuery(text);
                fetchSearchSuggestions(text);
              }}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => handleSearch()}>
              <Text style={styles.applyButtonText}>Search</Text>
            </TouchableOpacity>
            <FlatList
              data={searchResults}
              keyExtractor={item => item.place_id}
              renderItem={({item}) => (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  searchButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  calloutContainer: {
    padding: 10,
    alignItems: 'center',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calloutLink: {
    fontSize: 14,
    color: '#28a745',
    textDecorationLine: 'underline',
  },
  coupon: {
    fontSize: 14,
    color: 'green',
  },
  locationButton: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    backgroundColor: '#28a745',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
  filterButton: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    backgroundColor: '#28a745',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
  filterSearchButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#28a745',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
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
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  filterOption: {
    fontSize: 14,
    paddingVertical: 5,
  },
  filterActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
    paddingVertical: 5,
  },
  slider: {
    width: '100%',
    marginVertical: 10,
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  applyButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
    alignItems: 'center',
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  popupText: {
    fontSize: 14,
    marginBottom: 10,
  },
  popupButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  popupButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  popupCloseButton: {
    marginTop: 10,
  },
  popupCloseButtonText: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  
});

export default MapScreen;
