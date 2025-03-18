import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { Deal } from '../api/redux/deals-slice';

interface RouteParams {
  params: {
    coupon: Deal
  };
}

const CouponDetailsScreen = ({ route }: { route: RouteParams }) => {
  const { coupon } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  // Toggle favorite state
  const toggleFavorite = () => {
    setIsFavorite(prevState => !prevState);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: coupon.image }} style={styles.couponImage} />
      <View style={styles.detailsContainer}>
        <View style={styles.header}>
          <Text style={styles.couponCode}>Code: {coupon.code}</Text>
          <TouchableOpacity onPress={toggleFavorite} style={styles.heartIconContainer}>
            <Icon name="heart" size={24} color={isFavorite ? '#ff0000' : '#ccc'} />
          </TouchableOpacity>
        </View>
        <Text style={styles.details}>{coupon.discountPercentage}</Text>
        <Text style={styles.details}>{coupon.locationName}</Text>
        <Text style={styles.details}>{coupon.type}</Text>
        <Text style={styles.date}>End Date: {coupon.expirationDate}</Text>
        <Text style={styles.numberLeft}>Coupons Left: {coupon.quantity}</Text>
        <TouchableOpacity style={styles.redeemButton}>
          <Text style={styles.redeemButtonText}>Redeem</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
  },
  couponImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailsContainer: {
    width: '100%',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  couponCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  heartIconContainer: {
    padding: 5,
  },
  details: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
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
    marginTop: 20,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  redeemButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CouponDetailsScreen;
