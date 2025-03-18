import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import apiClient from '../api/apiClient';

// ✅ Define Types for Route Params
type RootStackParamList = {
  CouponsList: { item: { locationId: string; locationName: string } };
};

type CouponsListScreenRouteProp = RouteProp<RootStackParamList, 'CouponsList'>;
type CouponsListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CouponsList'>;

// ✅ Define Coupon Interface for Type Safety
interface Coupon {
  _id: string;
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
  startHour?: number;
  endHour?: number;
  comboItems: string[];
  comboPrice: number;
  expirationDate: string;
  image?: string;
}

const CouponsList: React.FC<CouponsListScreenNavigationProp> = () => {
  const route = useRoute<CouponsListScreenRouteProp>();
  const { locationId, locationName } = route.params.item;

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.get<Coupon[]>(`/coupons/${locationId}`);
      console.log('Coupons:', response.data);
      setCoupons(response.data || []);
    } catch (err: any) {
      console.error('Error fetching coupons:', err.response?.status, err.response?.data);
      setError('Failed to load coupons.');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Function to Format Discount
  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountPercentage > 0) {
      return `${coupon.discountPercentage}% off`;
    } else if (coupon.discountValue > 0) {
      return `$${coupon.discountValue} off`;
    } else if (coupon.familyPackPrice > 0) {
      return `Family Pack: $${coupon.familyPackPrice}`;
    } else if (coupon.comboPrice > 0) {
      return `Combo Deal: $${coupon.comboPrice}`;
    } else {
      return 'Special Deal';
    }
  };

  // 🔹 Function to Format Coupon Type
  const formatCouponType = (coupon: Coupon) => {
    switch (coupon.type) {
      case 'HappyHour':
        return `Happy Hour: ${coupon.startHour}:00 - ${coupon.endHour}:00`;
      case 'FamilyPack':
        return `Family Pack - Serves ${coupon.portionSize || '?'}`;
      case 'LimitedTime':
        return 'Limited Time Offer';
      case 'ComboDeal':
        return 'Combo Deal';
      case 'BOGO':
        return 'Buy One Get One Free';
      default:
        return coupon.type.replace(/([A-Z])/g, ' $1').trim();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Coupons for {locationName}</Text>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#28a745" />}

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Coupon List */}
      <FlatList
        data={coupons}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.image || 'https://via.placeholder.com/100' }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{formatCouponType(item)}</Text>
              <Text style={styles.cardCode}>Code: {item.code}</Text>
              <Text style={styles.cardDiscount}>{formatDiscount(item)}</Text>
              {item.description ? <Text style={styles.cardDescription}>{item.description}</Text> : null}
              <Text style={styles.cardExpiration}>Expires: {new Date(item.expirationDate).toDateString()}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={!loading && !error ? <Text style={styles.emptyText}>No coupons available.</Text> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, marginBottom: 10, elevation: 2 },
  cardImage: { width: 80, height: 80, borderRadius: 10 },
  cardContent: { flex: 1, padding: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  cardCode: { fontSize: 14, color: '#555' },
  cardDiscount: { fontSize: 14, color: '#28a745', fontWeight: 'bold', marginTop: 5 },
  cardDescription: { fontSize: 12, color: '#777', marginTop: 3 },
  cardExpiration: { fontSize: 12, color: '#777', marginTop: 3 },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginBottom: 10 },
  emptyText: { fontSize: 16, textAlign: 'center', marginTop: 20, color: '#777' },
});

export default CouponsList;
