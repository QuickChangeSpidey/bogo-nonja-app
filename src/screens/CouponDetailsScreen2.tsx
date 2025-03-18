import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface Coupon {
  _id: string;
  locationId: string;
  type: string;
  code: string;
  discountPercentage: number;
  discountValue: number;
  description?: string;
  purchasedItemIds: string[];
  freeItemIds: string[];
  familyPackItems: string[];
  familyPackPrice: number;
  minimumSpend: number;
  spendThresholds: any[];
  comboItems: string[];
  comboPrice: number;
  expirationDate: string;
  isActive: boolean;
  quantity: number;
  maxUsagePerUser: number;
  image?: string;
}

interface RouteParams {
  params: {
    coupon: Coupon;
  };
}

const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString();
};

const CouponDetailsScreen2 = ({ route }: { route: RouteParams }) => {
  const { coupon } = route.params;

  return (
    <View style={styles.container}>
      {/* Coupon Image */}
      <Image source={{ uri: coupon.image || 'https://via.placeholder.com/200' }} style={styles.couponImage} />

      <View style={styles.detailsContainer}>
        {/* Header Section */}
        <Text style={styles.couponCode}>Code: {coupon.code}</Text>

        {/* Coupon Details */}
        {coupon.type === 'BOGO' && (
          <>
            <Text style={styles.details}>Buy: {coupon.purchasedItemIds.join(', ') || 'Any item'}</Text>
            <Text style={styles.details}>Get: {coupon.freeItemIds.join(', ') || 'Any item'}</Text>
          </>
        )}

        {coupon.type === 'ComboDeal' && (
          <Text style={styles.details}>Combo: {coupon.comboItems.join(', ') || 'Multiple items'} for ${coupon.comboPrice}</Text>
        )}

        {coupon.type === 'FamilyPack' && (
          <Text style={styles.details}>Family Pack: {coupon.familyPackItems.join(', ') || 'Multiple items'} for ${coupon.familyPackPrice}</Text>
        )}

        {coupon.discountPercentage > 0 && (
          <Text style={styles.details}>Save {coupon.discountPercentage}%</Text>
        )}

        {coupon.discountValue > 0 && (
          <Text style={styles.details}>Save ${coupon.discountValue}</Text>
        )}

        {coupon.minimumSpend > 0 && (
          <Text style={styles.details}>Minimum Spend: ${coupon.minimumSpend}</Text>
        )}

        <Text style={styles.date}>Expires: {formatDateTime(coupon.expirationDate)}</Text>
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
  couponCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10,
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

export default CouponDetailsScreen2;