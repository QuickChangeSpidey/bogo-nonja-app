/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef } from 'react';
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
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../api/redux/store';
import { fetchDealsByCityAndCountry } from '../api/redux/deals-slice';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

  const dispatch = useDispatch<AppDispatch>();
  const { deals, loading, error } = useSelector((state: RootState) => state.deals);

  useEffect(() => {
    dispatch(fetchDealsByCityAndCountry({ city: 'Vancouver', country: 'Canada' }));
  }, [dispatch]);

  console.log('Deals:', deals);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A"; // Handle missing dates
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { 
      day: "2-digit", 
      month: "short", 
      year: "numeric", 
      hour: "2-digit", 
      minute: "2-digit", 
      hour12: false 
    }).replace(",", ""); // Removes comma between date & time
  };

  const dealCategories = Object.keys(deals);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={true}>
        {dealCategories.map((category) => {
          const categoryDeals = deals[category];
          if (categoryDeals.length === 0) return null;
          return (
            <View key={category} style={styles.dealSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{category.replace(/([A-Z])/g, ' $1')}</Text>
                <Icon name="chevron-right" size={28} color="#28a745" />
              </View>

              <FlatList
                data={categoryDeals}
                keyExtractor={(item) => item.couponId}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: 15, paddingLeft: 10, paddingRight: 10 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('CouponDetails', { coupon: item })}
                  >
                    <View style={styles.imageContainer}>
                      {/* ✅ Green Ribbon for Coupon Quantity */}
                      {item.quantity > 0 && (
                        <View style={styles.ribbonContainer}>
                          <Text style={styles.ribbonText}>{item.quantity} Available</Text>
                        </View>
                      )}

                      {/* Restaurant / Coupon Image */}
                      <Image source={{ uri: item.image }} style={styles.cardImage} />
                    </View>

                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{item.locationName}</Text>
                      <Text style={styles.cardSubtitle}>{item.address}</Text>
                      <Text style={styles.couponCode}>Code: {item.code}</Text>

                      {/* ✅ Coupon Type Specific Details */}
                      {item.type === 'BOGO' || item.type === 'Buy1Get1FreeItem' ? (
                        <>
                          <Text style={styles.cardSubtitle}>
                            Buy: {item.purchasedItems.join(', ') || 'Any item'}
                          </Text>
                          <Text style={styles.cardSubtitle}>
                            Get: {item.freeItems.join(', ') || 'Any item'}
                          </Text>
                        </>
                      ) : null}

                      {/* ✅ Coupon Type Specific Details */}
                      {item.type === 'FreeItemWithPurchase' ? (
                        <>
                          <Text style={styles.cardSubtitle}>
                            Buy: {item.purchasedItems.join(', ') || 'Any item'}
                          </Text>
                          <Text style={styles.cardSubtitle}>
                            Get: {item.freeItems.join(', ') || 'Any item'} Free
                          </Text>
                          <Text style={styles.cardSubtitle}>
                            On: {item.min} spent
                          </Text>
                        </>
                      ) : null}

                      {item.type === 'ComboDeal' ? (
                        <Text style={styles.couponCode}>
                          Combo: {item.comboItems.join(', ') || 'Multiple items'} for ${item.comboPrice}
                        </Text>
                      ) : null}

                      {item.type === 'FamilyPack' ? (
                        <Text style={styles.couponCode}>
                          Combo: {item.familyPackItems.join(', ') || 'Multiple items'} for ${item.familyPackPrice}
                        </Text>
                      ) : null}

                      {item.type === 'DiscountOnSpecificItems' ? (
                        <Text style={styles.couponCode}>
                          {item.discountPercentage
                            ? `Save ${item.discountPercentage}%`
                            : `Save $${item.discountValue}`} on{' '}
                          {item.purchasedItems.join(', ')}
                        </Text>
                      ) : null}

                      {item.type === 'SpendMoreSaveMore' ? (
                        <Text style={styles.couponCode}>
                          {item.discountPercentage
                            ? `Save ${item.discountPercentage}% on $${item.min}+ spent`
                            : `Save $${item.discountValue}`} on{' '}
                          {item.purchasedItems.join(', ')}
                        </Text>
                      ) : null}

                      {item.type === 'HappyHour' ? (
                        <Text style={styles.cardSubtitle}>
                          Happy Hour starts at {item.startHour} and ends at {item.endHour} for {item.discountPercentage}% off
                        </Text>
                      ) : null}

                      {item.type === 'StorewideFlatDiscount' ? (
                        <Text style={styles.couponCode}>
                          Save ${item.discountPercentage}% Flat
                        </Text>
                      ) : null}

                      {item.type === 'LimitedTime' ? (
                        <Text style={styles.cardSubtitle}>
                          Limited Time Deal starts at {formatDateTime(item.startTime)} and ends at {formatDateTime(item.endTime)}
                        </Text>
                      ) : null}


                      <Text style={styles.expiryDate}>
                        Expires: {new Date(item.expirationDate).toLocaleDateString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  container: { flex: 0.9, backgroundColor: '#fff' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 20,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', textTransform: 'capitalize' },
  dealSection: { marginVertical: 15 },
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
  cardImage: {
    width: '100%',
    height: 130,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
    backgroundColor: '#fff',
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
  couponCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
  },
  expiryDate: {
    fontSize: 12,
    color: '#888',
  },
  imageContainer: {
    position: 'relative', // Needed for absolute positioning of ribbon
  },
  ribbonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#28a745', // Green Ribbon
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
});

export default HomeScreen;
