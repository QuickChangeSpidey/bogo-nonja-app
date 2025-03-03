/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Entypo';
import { RootStackParamList } from '../../App';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Account Settings */}
      <Text style={styles.sectionTitle}>Account</Text>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Activity')}>
        <Icon name="bar-graph" size={20} color="#28a745" style={styles.icon} />
        <Text style={styles.optionText}>Account Activity</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => console.log('Security Settings')}>
        <Icon name="key" size={20} color="#28a745" style={styles.icon} />
        <Text style={styles.optionText}>Security Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => console.log('Preferences')}>
        <Icon name="star" size={20} color="#28a745" style={styles.icon} />
        <Text style={styles.optionText}>Preferences</Text>
      </TouchableOpacity>

      {/* App Settings */}
      <Text style={styles.sectionTitle}>App</Text>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('NotificationPermission')}>
        <Icon name="notification" size={20} color="#28a745" style={styles.icon} />
        <Text style={styles.optionText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => console.log('Language')}>
        <Icon name="language" size={20} color="#28a745" style={styles.icon} />
        <Text style={styles.optionText}>Language</Text>
      </TouchableOpacity>

      {/* Support */}
      <Text style={styles.sectionTitle}>Support</Text>
      <TouchableOpacity style={styles.option} onPress={() => console.log('FAQ and Help')}>
        <Icon name="info" size={20} color="#28a745" style={styles.icon} />
        <Text style={styles.optionText}>FAQ and Help</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => console.log('Legal and Privacy')}>
        <Icon name="awareness-ribbon" size={20} color="#28a745" style={styles.icon} />
        <Text style={styles.optionText}>Legal and Privacy</Text>
      </TouchableOpacity>

      {/* Danger Zone */}
      <Text style={styles.sectionTitleDanger}>Danger Zone</Text>
      <TouchableOpacity style={styles.option} onPress={() => console.log('Delete Account')}>
        <Icon name="trash" size={20} color="#dc3545" style={styles.icon} />
        <Text style={[styles.optionText, { color: '#dc3545' }]}>Delete Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Login')}>
        <Icon name="log-out" size={20} color="#dc3545" style={styles.icon} />
        <Text style={[styles.optionText, { color: '#dc3545' }]}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    marginVertical: 10,
  },
  sectionTitleDanger: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
    marginVertical: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    elevation: 2,
  },
  icon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default SettingsScreen;
