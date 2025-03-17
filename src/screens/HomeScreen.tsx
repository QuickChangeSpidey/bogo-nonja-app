/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../api/redux/store';
import { fetchDealsByCityAndCountry } from '../api/redux/deals-slice';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

  const dispatch = useDispatch<AppDispatch>();
  const { deals, loading, error } = useSelector((state: RootState) => state.deals);

  useEffect(() => {
    dispatch(fetchDealsByCityAndCountry({ city: 'Vancouver', country: 'Canada' }));
  }, [dispatch]);

  const dealCategories = Object.keys(deals);

  return (
    <SafeAreaView style={styles.container}>
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
                    onPress={() => navigation.navigate('RestaurantDetails', { id: item.locationId })}
                  >
                    <Image source={{ uri: item.image }} style={styles.cardImage} />
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{item.locationName}</Text>
                      <Text style={styles.cardSubtitle}>{item.address}</Text>
                      <Text style={styles.couponCode}>Code: {item.code}</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

export default HomeScreen;
