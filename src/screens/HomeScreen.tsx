/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import placesNearMe from '../api/places-near-me';
import genres from '../api/genres';
import {RootStackParamList} from '../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Entypo';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  // Refs for horizontal FlatLists
  const featuredDealsRef = useRef<FlatList>(null);
  const genreRefs = useRef<Record<string, FlatList | null>>({});

  const scrollToEnd = (ref: React.RefObject<FlatList>) => {
    if (ref.current) {
      ref.current.scrollToEnd({animated: true});
    }
  };

  const setGenreRef = (id: string, ref: FlatList | null) => {
    genreRefs.current[id] = ref;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={true}>
        {/* Section: Featured Deals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Deals</Text>
          <TouchableOpacity onPress={() => scrollToEnd(featuredDealsRef)}>
            <Icon name="chevron-right" size={28} color="#28a745" />
          </TouchableOpacity>
        </View>
        <FlatList
          ref={featuredDealsRef}
          data={placesNearMe}
          keyExtractor={item => item.id}
          horizontal
          style={{marginHorizontal: 15, paddingLeft: 10, paddingRight: 10}}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('RestaurantDetails')}>
              {item.coupons > 0 && (
                <View style={styles.ribbonContainer}>
                  <Text style={styles.ribbonText}>
                    {item.coupons} Available
                  </Text>
                </View>
              )}
              <Image source={{uri: item.image}} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.hours}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Section: Genres */}
        {genres.map(genre => (
          <View key={genre.id} style={styles.genreSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{genre.genre}</Text>
              <TouchableOpacity
                onPress={() =>
                  scrollToEnd({current: genreRefs.current[genre.id]})
                }>
                <Icon name="chevron-right" size={28} color="#28a745" />
              </TouchableOpacity>
            </View>
            <FlatList
              ref={ref => setGenreRef(genre.id, ref)}
              data={genre.restaurants}
              keyExtractor={item => item.id}
              horizontal
              style={{marginHorizontal: 15, paddingLeft: 10, paddingRight: 10}}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate('RestaurantDetails')}>
                  {item.coupons > 0 && (
                    <View style={styles.ribbonContainer}>
                      <Text style={styles.ribbonText}>
                        {item.coupons} Available
                      </Text>
                    </View>
                  )}
                  <Image source={{uri: item.image}} style={styles.cardImage} />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>{item.hours}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButton: {
    padding: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 20,
  },
  sectionTitle: {fontSize: 20, fontWeight: 'bold'},
  card: {
    width: 350,
    marginRight: 15,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: '#28a745',
  },
  cardContent: {
    padding: 12,
    backgroundColor: '#fff',
  },
  cardImage: {
    width: '100%',
    height: 130,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gridItem: {
    width: '48%',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  ribbonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomRightRadius: 10,
    zIndex: 1,
  },
  ribbonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#555',
    marginVertical: 5,
  },
  genreSection: {
    marginVertical: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
});

export default HomeScreen;
