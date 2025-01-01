import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input, Button, Text } from 'react-native-elements';
import { styles } from '../styles';

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(8, 'Too Short!')
    .matches(/[a-z]/, 'Must contain lowercase letter')
    .matches(/[A-Z]/, 'Must contain uppercase letter')
    .matches(/[0-9]/, 'Must contain number')
    .required('Required'),
});

const getPasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  return (strength / 4) * 100;
};

export default function SignUp({ navigation }: any) {
  const [passwordStrength, setPasswordStrength] = useState(0);

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={SignUpSchema}
        onSubmit={(values) => {
          Alert.alert('Success', 'Sign Up Successful!');
          navigation.navigate('Login');
        }}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <>
            <Input
              placeholder="Email"
              onChangeText={handleChange('email')}
              value={values.email}
              errorMessage={touched.email && errors.email}
              accessibilityLabel="Email input"
              autoCapitalize="none"
            />
            <Input
              placeholder="Password"
              secureTextEntry
              onChangeText={(text) => {
                handleChange('password')(text);
                setPasswordStrength(getPasswordStrength(text));
              }}
              value={values.password}
              errorMessage={touched.password && errors.password}
              accessibilityLabel="Password input"
            />
            <View style={styles.strengthContainer}>
              <View style={[styles.strengthBar, { width: `${passwordStrength}%` }]} />
              <Text>Password Strength: {passwordStrength}%</Text>
            </View>
            <Button
              title="Sign Up"
              onPress={handleSubmit}
              accessibilityRole="button"
              accessibilityLabel="Sign up button"
            />
            <Button
              title="Go to Login"
              type="clear"
              onPress={() => navigation.navigate('Login')}
            />
          </>
        )}
      </Formik>
    </View>
  );
}