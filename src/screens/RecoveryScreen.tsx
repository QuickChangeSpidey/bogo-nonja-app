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

// Define form values
interface FormValues {
  emailOrPhone: string;
}

// Validation schema
const ForgotSchema = Yup.object().shape({
  emailOrPhone: Yup.string().required('Email or Phone is required'),
});

const RecoveryScreen: React.FC = () => {
  const initialValues: FormValues = {
    emailOrPhone: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ForgotSchema}
      onSubmit={(values) => {
        console.log('Forgot Request:', values);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Forgot Password or Username</Text>
          <Text style={styles.description}>
            Enter your registered email or phone number, and we'll help you recover your account.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email or Phone"
            onChangeText={handleChange('emailOrPhone')}
            onBlur={handleBlur('emailOrPhone')}
            value={values.emailOrPhone}
          />
          {touched.emailOrPhone && errors.emailOrPhone && (
            <Text style={styles.error}>{errors.emailOrPhone}</Text>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color:'#28a745' },
  description: { fontSize: 20, textAlign: 'center', marginBottom: 20, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  error: { color: 'red', marginBottom: 10 },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
});

export default RecoveryScreen;
