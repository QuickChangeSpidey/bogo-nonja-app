import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface MenuItem {
  _id: string;
  name: string;
}

interface Coupon {
  _id: string;
  locationId: string;
  type: string;
  code: string;
  discountPercentage: number;
  discountValue: number;
  description?: string;
  purchasedItemIds: MenuItem[];
  freeItemIds: MenuItem[];
  familyPackItems: MenuItem[];
  familyPackPrice: number;
  minimumSpend: number;
  spendThresholds: any[];
  comboItems: MenuItem[];
  comboPrice: number;
  expirationDate: string;
  isActive: boolean;
  quantity: number;
  startHour?: number;
  endHour?: number;
  startTime?: string;
  endTime?: string;
  maxUsage: number;
  maxUsagePerUser: number;
  portionSize: number;
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

const getItemNames = (items: MenuItem[]) => {
  return items.length > 0 ? items.map(item => item.name).join(', ') : 'Any item';
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
            <Text style={styles.details}>Buy: {getItemNames(coupon.purchasedItemIds)}</Text>
            <Text style={styles.details}>Get: {getItemNames(coupon.freeItemIds)}</Text>
          </>
        )}

        {coupon.type === 'HappyHour' && (
          <>
            <Text style={styles.details}>Start: {coupon.startHour} hour</Text>
            <Text style={styles.details}>End: {coupon.endHour} hour</Text>
          </>
        )}

        {coupon.type === 'LimitedTime' && (
          <>
            <Text style={styles.details}>{coupon.description}</Text>
            <Text style={styles.details}>Start Time: {formatDateTime(coupon.startTime || '')}</Text>
            <Text style={styles.details}>End Time: {formatDateTime(coupon.endTime || '')}</Text>

          </>
        )}

        {coupon.type === 'ComboDeal' && (
          <Text style={styles.details}>Combo: {getItemNames(coupon.comboItems)} for ${coupon.comboPrice}</Text>
        )}

        {coupon.type === 'FamilyPack' && (
          <Text style={styles.details}>Family Pack: {getItemNames(coupon.familyPackItems)} for ${coupon.familyPackPrice} with portion size {coupon.portionSize}</Text>
        )}

        {coupon.type === 'DiscountOnSpecificItems' && (
          <Text style={styles.details}>${coupon.discountPercentage} on {getItemNames(coupon.purchasedItemIds)}</Text>
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
