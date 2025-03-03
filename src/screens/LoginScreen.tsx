import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Entypo';
import { RootStackParamList } from '../../App';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bogo Ninja</Text>
      <TextInput style={styles.input} placeholder="Username" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Main')}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.or}>OR</Text>

      <TouchableOpacity
        style={styles.socialButton}
        onPress={() => console.log('Login with Facebook')}>
        <Icon
          name="facebook"
          size={20}
          color="#28a745"
          style={styles.socialIcon}
        />

        <Text style={styles.socialButtonText}>Login with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialButton}
        onPress={() => console.log('Login with Google')}>
        <Icon
          name="google-"
          size={20}
          color="#28a745"
          style={styles.socialIcon}
        />

        <Text style={styles.socialButtonText}>Login with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Recovery')}>
        <Text style={styles.registerText}>Forgot Password? User Name</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#28a745',
    alignContent: 'center',
    textAlign: 'center',
    justifyContent:'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  or: {textAlign: 'center', marginVertical: 10, fontSize: 16},
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  socialIcon: {width: 20, height: 20, marginRight: 10},
  socialButtonText: {fontSize: 16, fontWeight: 'bold', color: '#000'},
  registerText: {textAlign: 'center', color: '#28a745', marginTop: 20, fontSize: 14, fontWeight:'bold'},
});

export default LoginScreen;
