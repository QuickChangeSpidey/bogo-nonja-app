/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
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
  Image,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import Icon from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';

export interface Restaurant {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  couponCount: number;
  logo?: string;
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const MapScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>();
  const [locations, setLocations] = useState<any[]>([]);
  const [isSearchFilterVisible, setIsSearchFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupRestaurant, setPopupRestaurant] = useState<Restaurant | null>(
    null,
  );
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Handle Marker Press
  const handleMarkerPress = (restaurant: Restaurant) => {
    setPopupRestaurant(restaurant);
    setIsPopupVisible(true);
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

  const getRestaurantData = async (latitude: number, longitude: number) => {
    try {
      // Use your custom client:
      const response = await axios.get(`http://10.0.2.2:5000/api/map-locations/query`, {
        params: {
          lat: latitude,
          long: longitude,
        },
      });
      setLocations(response.data.locations);
      // Do something with response.data (e.g., set state)
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error fetching restaurants:', error.message);
      } else {
        console.log('Error fetching restaurants:', error);
      }
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        getRestaurantData(latitude, longitude);
        if (mapRef.current) {
          mapRef.current.animateCamera({
            center: { latitude, longitude },
            zoom: 10,
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
        const { lat, lng } = response.data.result.geometry.location;
        mapRef.current?.animateCamera({
          center: { latitude: lat, longitude: lng },
          zoom: 15,
        });
        getRestaurantData(lat, lng);
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
        const { lat, lng } = response.data.results[0].geometry.location;
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
        {locations?.map((location: any) => {
          const [lng, lat] = location.coordinates;
          return (
            <Marker
              key={location.id}
              coordinate={{ latitude: lat, longitude: lng }}
              title={location.name}
              onPress={() => {
                setSelectedRestaurant({
                  id: location.id,
                  name: location.name,
                  latitude: lat,
                  longitude: lng,
                  couponCount: location.couponCount,
                });
                if (Platform.OS === 'android') {
                  handleMarkerPress({
                    id: location.id,
                    name: location.name,
                    latitude: lat,
                    longitude: lng,
                    couponCount: location.couponCount,
                    logo: location.logo,
                  });
                }
              }}
            >
              {Platform.OS === 'ios' && (
                <Callout onPress={() => navigation.navigate('CouponDetails')}>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{location.name}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('CouponDetails')}>
                      <Text style={styles.calloutLink}>Show Coupons</Text>
                      <Text style={styles.coupon}>
                        {location.coupons.length} Available
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Callout>
              )}
            </Marker>
          );
        })}

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

      {/* Search Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isSearchFilterVisible}
        onRequestClose={() => setIsSearchFilterVisible(false)}>
        <View style={styles.modalSearchContainer}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.filterTitle}>Search</Text>
              <TouchableOpacity onPress={() => setIsSearchFilterVisible(false)}>
                <Icon name="cross" size={24} color="black" />
              </TouchableOpacity>
            </View>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isPopupVisible}
        onRequestClose={() => setIsPopupVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsPopupVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {popupRestaurant && (
                <>
                  <Image source={{ uri: popupRestaurant.logo }} style={styles.restaurantImage} />
                  <Text style={styles.restaurantName}>{popupRestaurant.name}</Text>
                  <TouchableOpacity style={styles.couponText}>
                    <Text>
                      {popupRestaurant.couponCount} Coupons Available
                      {popupRestaurant.couponCount > 0}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.navigate('CouponsList', { item: { locationId: popupRestaurant.id.toString(), locationName: popupRestaurant.name } })}>
                    {popupRestaurant.couponCount > 0 && <Text style={styles.closeButtonText}>Show</Text>}
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSearchContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  restaurantImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  couponItem: {
    fontSize: 16,
    marginVertical: 5,
  },
  noCouponsText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'gray',
  },
  couponText: {
    fontSize: 16,
    color: 'green',
    marginBottom: 15,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  icon: {
    marginLeft: 5,
    color: '#28a745',
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
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
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
