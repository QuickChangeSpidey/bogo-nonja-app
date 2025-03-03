import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Sample genres with icons
const genres = [
  { id: '1', name: 'Pizza', icon: 'pizza' },
  { id: '2', name: 'Indian', icon: 'food-takeout-box' },
  { id: '3', name: 'Sushi', icon: 'fish' },
  { id: '4', name: 'Fast Food', icon: 'hamburger' },
  { id: '5', name: 'Bubble Tea', icon: 'cup' },
  { id: '6', name: 'Chinese', icon: 'bowl' },
  { id: '7', name: 'Korean', icon: 'rice' },
  { id: '8', name: 'Desserts', icon: 'cake' },
  { id: '9', name: 'Soup', icon: 'pot' },
  { id: '10', name: 'Wings', icon: 'food-drumstick' },
  { id: '11', name: 'Vietnamese', icon: 'noodles' },
  { id: '12', name: 'Mexican', icon: 'taco' },
  { id: '13', name: 'Thai', icon: 'bowl' },
  { id: '14', name: 'Halal', icon: 'cow' },
  { id: '15', name: 'Healthy', icon: 'leaf' },
  { id: '16', name: 'Japanese', icon: 'rice' },
  { id: '17', name: 'BBQ', icon: 'grill' },
  { id: '18', name: 'Asian', icon: 'bowl' },
  { id: '19', name: 'Sandwich', icon: 'bread-slice' },
  { id: '20', name: 'Ice Cream', icon: 'ice-cream' },
  { id: '21', name: 'Vegan', icon: 'sprout' },
  { id: '22', name: 'Greek', icon: 'alphabet-greek' },
  { id: '23', name: 'Breakfast', icon: 'egg' },
  { id: '24', name: 'Poke', icon: 'fish' },
  { id: '25', name: 'Italian', icon: 'pasta' },
  { id: '26', name: 'Bakery', icon: 'bread-slice' },
  { id: '27', name: 'Coffee', icon: 'coffee' },
  { id: '28', name: 'Taiwanese', icon: 'bowl' },
  { id: '29', name: 'Comfort Food', icon: 'home-heart' },
  { id: '30', name: 'Smoothies', icon: 'glass-cocktail' },
  { id: '31', name: 'Seafood', icon: 'fish' },
  { id: '32', name: 'American', icon: 'hamburger' },
  { id: '33', name: 'Salads', icon: 'food-apple' },
  { id: '34', name: 'Street Food', icon: 'food' },
  { id: '35', name: 'Hawaiian', icon: 'island' },
  { id: '36', name: 'Soul Food', icon: 'food' },
];

const GenresCarousel = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore by Genres</Text>
      <FlatList
        data={genres}
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

export default GenresCarousel;
