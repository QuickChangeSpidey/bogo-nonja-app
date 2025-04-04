import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import apiClient from '../api/apiClient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// ✅ Define API response types
interface Location {
  locationId: string;
  locationName: string;
  address: string;
  couponCount: number;
  image: string;
  hours: string;
}

interface ApiResponse {
  query: string;
  results: Location[];
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const getTodayHours = (hoursString: string): string => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = daysOfWeek[new Date().getDay()]; // Get today’s day abbreviation

  const regex = new RegExp(`${today}:\\s(\\d{1,2}:\\d{2}\\s[APM]{2}\\s*to\\s*\\d{1,2}:\\d{2}\\s[APM]{2})`);
  const match = hoursString.match(regex);

  return match ? match[1] : "Closed"; // Return found hours or "Closed"
};

const LocationSearchScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]); // Store favorite location IDs

  // useEffect(() => {
  //   fetchFavorites();
  // }, []);

  const fetchFavorites = async () => {
    try {
      const response = await apiClient.get('/favorites/locations'); // Assuming API exists for fetching favorites
      setFavorites(response.data.favorites || []);
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error fetching favorites:', (err as any).response?.data || err.message);
      } else {
        console.error('Error fetching favorites:', err);
      }
    }
  };

  const toggleFavorite = async (locationId: string) => {
    const isFavorite = favorites.includes(locationId);

    try {
      if (isFavorite) {
        await apiClient.delete(`/favorites/locations/${locationId}`);
        setFavorites(favorites.filter((id) => id !== locationId));
        Alert.alert('Removed', 'Location removed from favorites.');
      } else {
        await apiClient.post(`/favorites/locations/${locationId}`);
        setFavorites([...favorites, locationId]);
        Alert.alert('Added', 'Location added to favorites.');
      }
    } catch (err: any) {
      console.error('Error updating favorite:', err.response?.data || err.message);

      // 🔹 Check for Unauthorized Error (401)
      if (err.response?.status === 401) {
        Alert.alert('Session Expired', 'Please log in again.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('Error', 'Could not update favorites.');
      }
    }
  };


  const fetchLocations = async () => {
    if (!searchQuery.trim()) {
      setLocations([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = `/locations/query/search/${encodeURIComponent(searchQuery)}`;
      const response = await apiClient.get<ApiResponse>(url);
      setLocations(response.data.results || []);
    } catch (err: any) {
      console.error('Error fetching locations:', err.response?.status, err.response?.data);
      setError('Failed to load locations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search locations..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={fetchLocations} style={styles.searchButton}>
          <Icon name="magnifying-glass" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#28a745" />}

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Location List */}
      <FlatList
        data={locations}
        keyExtractor={(item) => item.locationId}
        renderItem={({ item }) => {
          const isFavorite = favorites.includes(item.locationId);

          return (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CouponsList', { item })}>
              {/* Image with Heart Icon Overlay */}
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <TouchableOpacity
                  style={styles.heartIcon}
                  onPress={() => toggleFavorite(item.locationId)}
                >
                  <MaterialCommunityIcons name={isFavorite ? "heart" : "heart-outline"} size={24} color="red" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.locationName}</Text>
                <Text style={styles.cardAddress}>{item.address}</Text>
                <Text style={styles.cardHours}>{getTodayHours(item.hours)}</Text>
                <Text style={styles.couponText}>
                  {item.couponCount > 0 ? `${item.couponCount} Coupons Available` : 'No Coupons Available'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={!loading && !error ? <Text style={styles.emptyText}>No locations found.</Text> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 0.9, backgroundColor: '#f9f9f9', padding: 20 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#28a745',
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    height: 50,
  },
  input: { flex: 1, fontSize: 18, color: '#333', paddingHorizontal: 10 },
  searchButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 12,
    marginLeft: 10,
  },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, marginBottom: 10, elevation: 2 },
  cardImage: { width: 120, height: 90, borderRadius: 10 },
  cardContent: { flex: 1, padding: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  cardAddress: { fontSize: 14, color: '#555' },
  cardHours: { fontSize: 12, color: '#777', marginTop: 3 },
  couponText: { fontSize: 14, color: '#28a745', fontWeight: 'bold', marginTop: 5 },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginBottom: 10 },
  emptyText: { fontSize: 16, textAlign: 'center', marginTop: 20, color: '#777' },
  imageContainer: {
    position: 'relative',
  },
  heartIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: 4,
  },
});

export default LocationSearchScreen;
