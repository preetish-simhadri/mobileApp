import React, { useEffect } from 'react';
import { View, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, Button, CheckBox } from 'react-native-elements';
import { styles } from '../styles';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
  rememberMe: Yup.boolean(),
});

export default function Login({ navigation }: any) {
  const formikRef = React.useRef(null);

  useEffect(() => {
    AsyncStorage.getItem('rememberedEmail').then((email) => {
      if (email) {
        formikRef.current?.setFieldValue('email', email);
        formikRef.current?.setFieldValue('rememberMe', true);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Formik
        innerRef={formikRef}
        initialValues={{ email: '', password: '', rememberMe: false }}
        validationSchema={LoginSchema}
        onSubmit={async (values) => {
          if (values.rememberMe) {
            await AsyncStorage.setItem('rememberedEmail', values.email);
          } else {
            await AsyncStorage.removeItem('rememberedEmail');
          }
          Alert.alert('Success', 'Login Successful!');
        }}
      >
        {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
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
              onChangeText={handleChange('password')}
              value={values.password}
              errorMessage={touched.password && errors.password}
              accessibilityLabel="Password input"
            />
            <CheckBox
              title="Remember Me"
              checked={values.rememberMe}
              onPress={() => setFieldValue('rememberMe', !values.rememberMe)}
              accessibilityRole="checkbox"
              accessibilityLabel="Remember me checkbox"
            />
            <Button
              title="Login"
              onPress={handleSubmit}
              accessibilityRole="button"
              accessibilityLabel="Login button"
            />
            <Button
              title="Go to Sign Up"
              type="clear"
              onPress={() => navigation.navigate('SignUp')}
            />
          </>
        )}
      </Formik>
    </View>
  );
}