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

const CouponsList: React.FC<CouponsListScreenNavigationProp> = ({navigate}) => {
  const route = useRoute<CouponsListScreenRouteProp>();
  const { locationId, locationName } = route.params.item; // ✅ Get locationId from params

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.get(`/coupons/${locationId}`);
      console.log('Coupons:', response.data);
      setCoupons(response.data || []);
    } catch (err: any) {
      console.error('Error fetching coupons:', err.response?.status, err.response?.data);
      setError('Failed to load coupons.');
    } finally {
      setLoading(false);
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
              <Text style={styles.cardTitle}>{item.type}</Text>
              <Text style={styles.cardCode}>Code: {item.code}</Text>
              <Text style={styles.cardDiscount}>
                {item.discountPercentage > 0
                  ? `${item.discountPercentage}% off`
                  : item.discountValue > 0
                  ? `$${item.discountValue} off`
                  : 'Special Deal'}
              </Text>
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
  cardExpiration: { fontSize: 12, color: '#777', marginTop: 3 },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginBottom: 10 },
  emptyText: { fontSize: 16, textAlign: 'center', marginTop: 20, color: '#777' },
});

export default CouponsList;
