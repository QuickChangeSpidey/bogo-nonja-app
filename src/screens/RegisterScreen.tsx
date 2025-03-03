import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import  Icon from 'react-native-vector-icons/Entypo';

interface FormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Validation schema
const RegistrationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
});

const RegisterScreen: React.FC = () => {
  const initialValues: FormValues = {
    name: '',
    email: '',
    phone: '',
    address: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={RegistrationSchema}
      onSubmit={(values) => {
        console.log('Registration Data:', values);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Register</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
          />
          {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
          />
          {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Phone"
            keyboardType="phone-pad"
            onChangeText={handleChange('phone')}
            onBlur={handleBlur('phone')}
            value={values.phone}
          />
          {touched.phone && errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Address"
            onChangeText={handleChange('address')}
            onBlur={handleBlur('address')}
            value={values.address}
          />
          {touched.address && errors.address && <Text style={styles.error}>{errors.address}</Text>}

          <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={() => console.log('Login with Facebook')}>
            <Icon name="facebook" size={20} color="#28a745" style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Register with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={() => console.log('Login with Google')}>
            <Icon name="google-" size={20} color="#28a745" style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Register with Google</Text>
      </TouchableOpacity>


        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 34, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color:'#28a745' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  error: { color: 'red', marginBottom: 10 },
  registerButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  registerButtonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
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
  socialIcon: { width: 20, height: 20, marginRight: 10 },
  socialButtonText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
});

export default RegisterScreen;
