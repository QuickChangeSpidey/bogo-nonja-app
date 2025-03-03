import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

// Mock data for recent activities
const recentActivities = [
  {
    id: '1',
    coupon: '20% Off Pizza',
    restaurant: 'Pizza Hub',
    date: '2024-11-27 14:30',
  },
  {
    id: '2',
    coupon: 'Buy 1 Get 1 Free Burger',
    restaurant: 'Burger King',
    date: '2024-11-25 18:15',
  },
  {
    id: '3',
    coupon: 'Free Dessert with Meal',
    restaurant: 'Golden Dragon',
    date: '2024-11-23 12:00',
  },
  {
    id: '4',
    coupon: '10% Off Entire Bill',
    restaurant: 'Taco Bell',
    date: '2024-11-22 19:45',
  },
  {
    id: '5',
    coupon: '25% Off Sushi',
    restaurant: 'Sushi Heaven',
    date: '2024-11-20 13:10',
  },
];

const ActivityScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={recentActivities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.couponText}>{item.coupon}</Text>
            <Text style={styles.restaurantText}>Used at: {item.restaurant}</Text>
            <Text style={styles.dateText}>Date: {item.date}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No recent activities.</Text>}
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
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  couponText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#777',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
});

export default ActivityScreen;
