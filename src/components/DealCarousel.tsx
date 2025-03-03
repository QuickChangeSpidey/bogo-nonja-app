import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Sample deal types with icons
const dealTypes = [
  { id: '1', name: 'Percentage Discount', icon: 'percent' },
  { id: '2', name: 'BOGO', icon: 'gift' },
  { id: '3', name: 'Fixed Discount', icon: 'sale' },
  { id: '4', name: 'Free Item', icon: 'shopping-basket' },
  { id: '5', name: 'Combo Deals', icon: 'handshake' },
  { id: '6', name: 'Happy Hour', icon: 'clock' },
  { id: '7', name: 'Seasonal Deals', icon: 'flask' },
  { id: '8', name: 'Limited-Time Offers', icon: 'airplane-clock' },
  { id: '9', name: 'Set Menu Deals', icon: 'silverware' },
];

const DealCarousel = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deal Types</Text>
      <FlatList
        data={dealTypes}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.iconContainer}>
              <Icon name={item.icon} size={24} color="#28a745" />
            </View>
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28a745',
    borderRadius: 12,
    marginRight: 10,
    padding: 10,
    width: 110,
    height: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#28a745',
  },
  iconContainer: {
    backgroundColor: '#e6f7eb',
    borderRadius: 50,
    padding: 10,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
});

export default DealCarousel;
