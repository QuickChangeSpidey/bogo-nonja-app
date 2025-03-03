import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { RootStackParamList } from '../../App';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

const NotificationPermissionScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  const openNotificationSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>BogoNinja</Text>
        <Text style={styles.heading}>Be the first to know about breaking deals.</Text>
        <Text style={styles.subText}>Please allow notifications from us.</Text>
        <TouchableOpacity style={styles.button} onPress={openNotificationSettings}>
          <Text style={styles.buttonText}>Allow notifications</Text>
          <Text style={styles.arrow}>➜</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.skipButton} onPress={()=> navigation.navigate('Accounts')}>
        <Text style={styles.skipText}>Skip ➜</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 30,
    marginTop: 300,
    backgroundColor: '#28a745',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  arrow: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    marginLeft: 10,
  },
  skipButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  skipText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textDecorationLine: 'underline',
  },
});

export default NotificationPermissionScreen;
