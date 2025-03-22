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
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

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

const RestaurantListByGenre:React.FC<HomeScreenProps> = ({navigation}) => {
  const [data, setData] = useState<Data>({ restaurants: {} });
  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });

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

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        fetchRestaurantData(latitude, longitude);
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

  const fetchRestaurantData = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `http://api.bogoninja.com/api/restaurant-locations/query?lat=${latitude}&long=${longitude}`
      );
      console.log(response.data);
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
              renderItem={({ item }) => (
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
                  <Image source={{ uri: item.logo }} style={styles.cardImage} />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>{item.address}</Text>
                    <Text style={styles.cardCoupon}>
                      {item.couponCount} Coupons Available </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        );
      })}
    </ScrollView>
  </SafeAreaView>
);

};

const styles = StyleSheet.create({
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
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: { padding: 10, backgroundColor: '#fff' },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 12, color: '#555', marginTop: 5 },
  cardCoupon: { fontSize: 12, color: 'green', marginTop: 5 },
});

export default RestaurantListByGenre;

