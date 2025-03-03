/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import mockCoupons from '../api/mock-coupons';
import Icon from 'react-native-vector-icons/Entypo';

const RestaurantDetailsScreen: React.FC = () => {
  // State to manage favorite coupons
  const [favoriteCoupons, setFavoriteCoupons] = useState<string[]>([]);

  // Toggle favorite state
  const toggleFavorite = (id: string) => {
    setFavoriteCoupons(prevFavorites =>
      prevFavorites.includes(id)
        ? prevFavorites.filter(favId => favId !== id)
        : [...prevFavorites, id],
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockCoupons}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const isFavorite = favoriteCoupons.includes(item.id);
          return (
            <View style={styles.card}>
              <Image source={{uri: item.image}} style={styles.couponImage} />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.couponCode}>Code: {item.id}</Text>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(item.id)}
                    style={[
                      styles.heartIconContainer,
                      isFavorite
                        ? styles.heartIconActive
                        : styles.heartIconInactive,
                    ]}>
                    <Icon
                      name="heart"
                      size={20}
                      color={isFavorite ? '#fff' : '#28a745'}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.details}>{item.details}</Text>
                <Text style={styles.date}>Start Date: {item.start_date}</Text>
                <Text style={styles.date}>End Date: {item.end_date}</Text>
                <Text style={styles.numberLeft}>
                  Coupons Left: {item.number_left}
                </Text>
                <TouchableOpacity style={styles.redeemButton}>
                  <Text style={styles.redeemButtonText}>Redeem</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No coupons available.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#555',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  couponImage: {
    width: 150,
    height: 150,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  heartIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  heartIconInactive: {
    borderColor: '#28a745',
    backgroundColor: 'transparent',
  },
  heartIconActive: {
    borderColor: '#28a745',
    backgroundColor: '#28a745',
  },
  details: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  numberLeft: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
    marginTop: 5,
  },
  redeemButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 5,
  },
  redeemButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
});

export default RestaurantDetailsScreen;
