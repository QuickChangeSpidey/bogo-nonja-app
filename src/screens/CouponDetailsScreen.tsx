import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { Deal } from '../api/redux/deals-slice';

interface RouteParams {
  params: {
    coupon: Deal
  };
}

const formatDateTime = (dateTime: string | Date) => {
  const date = new Date(dateTime);
  return date.toLocaleString(); // Formats as "MM/DD/YYYY, HH:MM AM/PM"
};


const CouponDetailsScreen = ({ route }: { route: RouteParams }) => {
  const { coupon } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  // Toggle favorite state
  const toggleFavorite = () => {
    setIsFavorite(prevState => !prevState);
  };

  return (
<View style={styles.container}>
      {/* Coupon Image */}
      <Image source={{ uri: coupon.image }} style={styles.couponImage} />

      <View style={styles.detailsContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.couponCode}>Code: {coupon.code}</Text>
          <TouchableOpacity onPress={toggleFavorite} style={styles.heartIconContainer}>
            <Icon name="heart" size={24} color={isFavorite ? '#ff0000' : '#ccc'} />
          </TouchableOpacity>
        </View>

        {/* Location & Address */}
        <Text style={styles.details}>{coupon.locationName}</Text>
        <Text style={styles.details}>{coupon.address}</Text>


        {/* ✅ Coupon Type Specific Details */}
        {coupon.type === 'BOGO' || coupon.type === 'Buy1Get1FreeItem' ? (
          <>
            <Text style={styles.details}>Buy: {coupon.purchasedItems.join(', ') || 'Any item'}</Text>
            <Text style={styles.details}>Get: {coupon.freeItems.join(', ') || 'Any item'}</Text>
          </>
        ) : null}

        {coupon.type === 'FreeItemWithPurchase' ? (
          <>
            <Text style={styles.details}>Buy: {coupon.purchasedItems.join(', ') || 'Any item'}</Text>
            <Text style={styles.details}>Get: {coupon.freeItems.join(', ') || 'Any item'} Free</Text>
            <Text style={styles.details}>On: ${coupon.min} spent</Text>
          </>
        ) : null}

        {coupon.type === 'ComboDeal' ? (
          <Text style={styles.details}>
            Combo: {coupon.comboItems.join(', ') || 'Multiple items'} for ${coupon.comboPrice}
          </Text>
        ) : null}

        {coupon.type === 'FamilyPack' ? (
          <Text style={styles.details}>
            Family Pack: {coupon.familyPackItems.join(', ') || 'Multiple items'} for ${coupon.familyPackPrice}
          </Text>
        ) : null}

        {coupon.type === 'DiscountOnSpecificItems' ? (
          <Text style={styles.details}>
            {coupon.discountPercentage
              ? `Save ${coupon.discountPercentage}%`
              : `Save $${coupon.discountValue}`} on {coupon.purchasedItems.join(', ')}
          </Text>
        ) : null}

        {coupon.type === 'SpendMoreSaveMore' ? (
          <Text style={styles.details}>
            {coupon.discountPercentage
              ? `Save ${coupon.discountPercentage}% on $${coupon.min}+ spent`
              : `Save $${coupon.discountValue}`} on {coupon.purchasedItems.join(', ')}
          </Text>
        ) : null}

        {coupon.type === 'HappyHour' ? (
          <Text style={styles.details}>
            Happy Hour: {coupon.startHour} - {coupon.endHour} ({coupon.discountPercentage}% off)
          </Text>
        ) : null}

        {coupon.type === 'StorewideFlatDiscount' ? (
          <Text style={styles.details}>
            Storewide Discount: Save {coupon.discountPercentage}%
          </Text>
        ) : null}

        {coupon.type === 'LimitedTime' ? (
          <Text style={styles.details}>
            Limited Time Offer: {formatDateTime(coupon.startTime)} - {formatDateTime(coupon.endTime)}
          </Text>
        ) : null}

        {/* Expiry Date & Quantity Left */}
        <Text style={styles.date}>Expires: {new Date(coupon.expirationDate).toLocaleDateString()}</Text>
        <Text style={styles.numberLeft}>Coupons Left: {coupon.quantity}</Text>

        {/* Redeem Button */}
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
