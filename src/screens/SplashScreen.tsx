/* eslint-disable react-hooks/exhaustive-deps */
// SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
};

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type SplashScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: SplashScreenNavigationProp;
  route: SplashScreenRouteProp;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate to Home Screen after animation
      navigation.replace('Home');
    });
  }, [navigation, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Text style={styles.logo}>BOGO NINJA</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28a745',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default SplashScreen;
