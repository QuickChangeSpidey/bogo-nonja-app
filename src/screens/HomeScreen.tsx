/* eslint-disable react-native/no-inline-styles */
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
  Modal,
  TextInput,
} from 'react-native';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../api/redux/store';
import { fetchDealsByCityAndCountry } from '../api/redux/deals-slice';
import axios from 'axios';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

  const dispatch = useDispatch<AppDispatch>();
  const { deals, loading, error } = useSelector((state: RootState) => state.deals);
  const [isSearchFilterVisible, setIsSearchFilterVisible] = useState(false);
  const GOOGLE_MAPS_API_KEY = 'AIzaSyBxeae0ftXUhPZ8bZWE1-xgaWEkJFKGjek';
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [searchResults, setSearchResults] = useState<any[]>([]); // For location suggestions
  const [city, setCity] = useState<string>('Vancouver'); // For location suggestions
  const [state, setState] = useState<string>('BC'); // For location suggestions
  const [country, setCountry] = useState<string>('Canada'); // For location suggestions
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
            province = component.long_name;
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
        setIsSearchFilterVisible(false); // Close modal after search
      } else {
        console.warn('Location not found. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  useEffect(() => {
    dispatch(fetchDealsByCityAndCountry({ city: city, country: country }));
  }, [dispatch, city, country, state]);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A"; // Handle missing dates
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).replace(",", ""); // Removes comma between date & time
  };

  const dealCategories = Object.keys(deals);
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'flex-end' }}>
      <Text style={styles.countryStateText}>{city}, {state}, {country}</Text> 
       <Icon name="location" size={28} color="#28a745" style={{ margin: 10 }} onPress={()=>setIsSearchFilterVisible(true)} />
      </View> 
      <ScrollView showsVerticalScrollIndicator={true}>
        {dealCategories.map((category) => {
          const categoryDeals = deals[category];
          if (categoryDeals.length === 0) return null;
          return (
            <View key={category} style={styles.dealSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{category.replace(/([A-Z])/g, ' $1')}</Text>
                <Icon name="chevron-right" size={28} color="#28a745" />
              </View>

              <FlatList
                data={categoryDeals}
                keyExtractor={(item) => item.couponId}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: 15, paddingLeft: 10, paddingRight: 10 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('CouponDetails', { coupon: item })}
                  >
                    <View style={styles.imageContainer}>
                      {/* ✅ Green Ribbon for Coupon Quantity */}
                      {item.quantity > 0 && (
                        <View style={styles.ribbonContainer}>
                          <Text style={styles.ribbonText}>{item.quantity} Available</Text>
                        </View>
                      )}

                      {/* Restaurant / Coupon Image */}
                      <Image source={{ uri: item.image }} style={styles.cardImage} />
                    </View>

                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{item.locationName}</Text>
                      <Text style={styles.cardSubtitle}>{item.address}</Text>
                      <Text style={styles.couponCode}>Code: {item.code}</Text>

                      {/* ✅ Coupon Type Specific Details */}
                      {item.type === 'BOGO' || item.type === 'Buy1Get1FreeItem' ? (
                        <>
                          <Text style={styles.cardSubtitle}>
                            Buy: {item.purchasedItems.join(', ') || 'Any item'}
                          </Text>
                          <Text style={styles.cardSubtitle}>
                            Get: {item.freeItems.join(', ') || 'Any item'}
                          </Text>
                        </>
                      ) : null}

                      {/* ✅ Coupon Type Specific Details */}
                      {item.type === 'FreeItemWithPurchase' ? (
                        <>
                          <Text style={styles.cardSubtitle}>
                            Buy: {item.purchasedItems.join(', ') || 'Any item'}
                          </Text>
                          <Text style={styles.cardSubtitle}>
                            Get: {item.freeItems.join(', ') || 'Any item'} Free
                          </Text>
                          <Text style={styles.cardSubtitle}>
                            On: {item.min} spent
                          </Text>
                        </>
                      ) : null}

                      {item.type === 'ComboDeal' ? (
                        <Text style={styles.couponCode}>
                          Combo: {item.comboItems.join(', ') || 'Multiple items'} for ${item.comboPrice}
                        </Text>
                      ) : null}

                      {item.type === 'FamilyPack' ? (
                        <Text style={styles.couponCode}>
                          Combo: {item.familyPackItems.join(', ') || 'Multiple items'} for ${item.familyPackPrice}
                        </Text>
                      ) : null}

                      {item.type === 'DiscountOnSpecificItems' ? (
                        <Text style={styles.couponCode}>
                          {item.discountPercentage
                            ? `Save ${item.discountPercentage}%`
                            : `Save $${item.discountValue}`} on{' '}
                          {item.purchasedItems.join(', ')}
                        </Text>
                      ) : null}

                      {item.type === 'SpendMoreSaveMore' ? (
                        <Text style={styles.couponCode}>
                          {item.discountPercentage
                            ? `Save ${item.discountPercentage}% on $${item.min}+ spent`
                            : `Save $${item.discountValue}`} on{' '}
                          {item.purchasedItems.join(', ')}
                        </Text>
                      ) : null}

                      {item.type === 'HappyHour' ? (
                        <Text style={styles.cardSubtitle}>
                          Happy Hour starts at {item.startHour} and ends at {item.endHour} for {item.discountPercentage}% off
                        </Text>
                      ) : null}

                      {item.type === 'StorewideFlatDiscount' ? (
                        <Text style={styles.couponCode}>
                          Save ${item.discountPercentage}% Flat
                        </Text>
                      ) : null}

                      {item.type === 'LimitedTime' ? (
                        <Text style={styles.cardSubtitle}>
                          Limited Time Deal starts at {formatDateTime(item.startTime)} and ends at {formatDateTime(item.endTime)}
                        </Text>
                      ) : null}


                      <Text style={styles.expiryDate}>
                        Expires: {new Date(item.expirationDate).toLocaleDateString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          );
        })}
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
      </ScrollView>
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  searchButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  container: { flex: 0.9, backgroundColor: '#fff' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 20,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', textTransform: 'capitalize' },
  dealSection: { marginVertical: 15 },
  card: {
    width: 350,
    marginRight: 15,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: '#28a745',
  },
  cardImage: {
    width: '100%',
    height: 130,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#555',
    marginVertical: 5,
  },
  couponCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
  },
  expiryDate: {
    fontSize: 12,
    color: '#888',
  },
  imageContainer: {
    position: 'relative', // Needed for absolute positioning of ribbon
  },
  ribbonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#28a745', // Green Ribbon
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomRightRadius: 10,
    zIndex: 1,
  },
  ribbonText: {
    color: '#28a745',
    fontSize: 12,
    fontWeight: 'bold',
  },
  countryStateText: {
    color: '#28a745',
    fontSize: 12,
    margin: 10,
    fontWeight: 'bold',
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
});

export default HomeScreen;
