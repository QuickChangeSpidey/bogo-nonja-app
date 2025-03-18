/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Modal,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { Animated, Easing } from 'react-native';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import LocationSearchScreen from './src/screens/LocationSearchScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import FavoriteScreen from './src/screens/FavoriteScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import RecoveryScreen from './src/screens/RecoveryScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';
import MapScreen from './src/screens/MapScreen';
import CouponDetailsScreen from './src/screens/CouponDetailsScreen';
// import SearchScreen from './src/screens/SearchScreen';
import NotificationPermissionScreen from './src/screens/NotificationPermissionScreen';
import { Provider } from 'react-redux';
import store from './src/api/redux/store';
import { Deal } from './src/api/redux/deals-slice';
import CouponsList from './src/screens/CouponsList';
import CouponDetailsScreen2 from './src/screens/CouponDetailsScreen2';

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Recovery: undefined;
  Activity: undefined;
  CouponsList: { item: { locationId: string; locationName: string } };
  CouponDetails: { coupon?: Deal } | undefined;
  CouponDetails2: { coupon?: Deal } | undefined;
  Accounts: undefined;
  NotificationPermission: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const QRButton = ({ onPress }: any) => (
  <TouchableOpacity style={styles.qrButton} onPress={onPress}>
    <Icon name="camera" size={30} color="#fff" />
  </TouchableOpacity>
);

const SplashScreen = ({ navigation, onSplashEnd }: any) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        onSplashEnd();
      }, 1000);
    });
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.splashContainer}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}>
        <Text style={styles.splashText}>Bogo Ninja</Text>
      </Animated.View>
    </View>
  );
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, string> = {
          Home: 'home',
          Search: 'magnifying-glass',
          Activity: 'cycle',
          Deals: 'price-tag',
          Favorites: 'heart',
          Map: 'globe',
        };
        return (
          <Icon
            name={icons[route.name] || 'circle'}
            size={size}
            color={color}
          />
        );
      },
      tabBarActiveTintColor: '#28a745',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: styles.tabBar,
      headerLeft: () => null, // Prevents any left header button across all tabs
    })}>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Search"
      component={LocationSearchScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="QRScanner"
      component={QRScannerScreen}
      options={{
        headerShown: false,
        tabBarButton: props => (
          <View style={styles.qrButtonWrapper}>
            <QRButton onPress={props.onPress} />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Map"
      component={MapScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Favorites"
      component={FavoriteScreen}
      options={{ headerShown: false }}
    />

  </Tab.Navigator>
);

const App = () => {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [isPhoneModalVisible, setPhoneModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSplashEnd = () => {
    setSplashVisible(false);
    // setPhoneModalVisible(true); // Show modal after splash ends
  };

  const handlePhoneSubmit = () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (phoneRegex.test(phoneNumber)) {
      setPhoneModalVisible(false);
      Alert.alert('Success', 'You will now receive deal notifications!');
    } else {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number.');
    }
  };

  const handleSkip = () => {
    setPhoneModalVisible(false);
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        {isSplashVisible ? (
          <SplashScreen onSplashEnd={handleSplashEnd} />
        ) : (
          <>
            <Stack.Navigator initialRouteName="Main">
              <Stack.Screen
                name="Main"
                component={MainTabs}
                options={({ navigation }) => ({
                  headerBackVisible: false,
                  headerRight: () => (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Accounts')}>
                      <Icon name="user" size={25} color="#28a745" />
                    </TouchableOpacity>
                  ),
                  headerTitle: () => <Text style={styles.title}>Bogo Ninja</Text>,
                  headerStyle: { backgroundColor: '#fff' },
                  headerTitleStyle: { color: '#28a745' },
                })}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={({ }) => ({
                  headerShown: false,
                })}
              />
              <Stack.Screen
                name="NotificationPermission"
                component={NotificationPermissionScreen}
                options={({ }) => ({
                  headerShown: false,
                })}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={({ navigation }) => ({
                  headerTitle: () => <Text style={styles.title}>Bogo Ninja</Text>,
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Icon name="chevron-left" size={28} color="#28a745" />
                    </TouchableOpacity>
                  ),
                  headerStyle: { backgroundColor: '#fff' },
                  headerTitleStyle: { color: '#28a745' },
                })}
              />
              <Stack.Screen
                name="CouponsList"
                component={CouponsList}
                options={({ navigation }) => ({
                  headerTitle: () => <Text style={styles.title}>Bogo Ninja</Text>,
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Icon name="chevron-left" size={28} color="#28a745" />
                    </TouchableOpacity>
                  ),
                  headerStyle: { backgroundColor: '#fff' },
                  headerTitleStyle: { color: '#28a745' },
                })}
              />
              <Stack.Screen
                name="Recovery"
                component={RecoveryScreen}
                options={({ navigation }) => ({
                  headerTitle: () => <Text style={styles.title}>Bogo Ninja</Text>,
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Icon name="chevron-left" size={28} color="#28a745" />
                    </TouchableOpacity>
                  ),
                  headerStyle: { backgroundColor: '#fff' },
                  headerTitleStyle: { color: '#28a745' },
                })}
              />
              <Stack.Screen
                name="CouponDetails"
                options={({ navigation }) => ({
                  headerTitle: () => <Text style={styles.title}>Bogo Ninja</Text>,
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Icon name="chevron-left" size={28} color="#28a745" />
                    </TouchableOpacity>
                  ),
                  headerStyle: { backgroundColor: '#fff' },
                  headerTitleStyle: { color: '#28a745' },
                })}
                component={CouponDetailsScreen}
              />
              <Stack.Screen
                name="CouponDetails2"
                options={({ navigation }) => ({
                  headerTitle: () => <Text style={styles.title}>Bogo Ninja</Text>,
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Icon name="chevron-left" size={28} color="#28a745" />
                    </TouchableOpacity>
                  ),
                  headerStyle: { backgroundColor: '#fff' },
                  headerTitleStyle: { color: '#28a745' },
                })}
                component={CouponDetailsScreen2}
              />
              <Stack.Screen
                name="Activity"
                component={ActivityScreen}
                options={({ navigation }) => ({
                  headerTitle: () => <Text style={styles.title}>Bogo Ninja</Text>,
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Icon name="chevron-left" size={28} color="#28a745" />
                    </TouchableOpacity>
                  ),
                  headerStyle: { backgroundColor: '#fff' },
                  headerTitleStyle: { color: '#28a745' },
                })}
              />
              <Stack.Screen
                name="Accounts"
                component={SettingsScreen}
                options={({ navigation }) => ({
                  headerTitle: () => <Text style={styles.title}>Bogo Ninja</Text>,
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('Main')}>
                      <Icon name="chevron-left" size={28} color="#28a745" />
                    </TouchableOpacity>
                  ),
                  headerStyle: { backgroundColor: '#fff' },
                  headerTitleStyle: { color: '#28a745' },
                })}
              />
            </Stack.Navigator>

            {/* Phone Modal */}
            <Modal
              visible={isPhoneModalVisible}
              transparent
              animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  {/* Close Button */}
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={handleSkip}>
                    <Icon name="cross" size={30} color="#28a745" />
                  </TouchableOpacity>

                  {/* Image Section */}
                  <View style={styles.modalImageContainer}>
                    <Image
                      source={require('../CustomerApp/src/assets/deals-banner.png')} // Replace with your image path
                      style={styles.modalImage}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Text & Input Section */}
                  <View style={styles.modalBody}>
                    <Text style={styles.modalTitle}>
                      Get the Best Deals Nearby!
                    </Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Enter your phone number"
                      keyboardType="phone-pad"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                    />
                    {/* Centered Submit Button */}
                    <TouchableOpacity
                      style={styles.modalSubmitButton}
                      onPress={handlePhoneSubmit}>
                      <Text style={styles.modalSubmitButtonText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </>
        )}
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28a745',
  },
  splashText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabBar: {
    position: 'absolute',
    height: 70,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  qrButtonWrapper: {
    top: -20,
    alignItems: 'center',
  },
  qrButton: {
    backgroundColor: '#28a745',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    height: '70%',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
  },
  modalCloseButton: {
    position: 'absolute',
    bottom: 220,
    right: 10,
    zIndex: 10,
  },
  modalImageContainer: {
    height: '60%',
    width: '100%',
    backgroundColor: '#fff',
  },
  modalImage: {
    height: '100%',
    width: '100%',
  },
  modalBody: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '90%',
    marginBottom: 30,
    fontSize: 16,
  },
  modalSubmitButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  modalSubmitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
