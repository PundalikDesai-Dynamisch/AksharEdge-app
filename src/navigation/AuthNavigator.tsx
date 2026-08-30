import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { strings } from '@/constants/strings';
import ForgotPasswordScreen from '@features/auth/screens/ForgotPasswordScreen';
import LoginScreen from '@features/auth/screens/LoginScreen';
import RegisterScreen from '@features/auth/screens/RegisterScreen';
import WelcomeScreen from '@features/auth/screens/WelcomeScreen';

import type { AuthStackParamList } from './types';

import { defaultStackOptions } from './screenOptions';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={defaultStackOptions}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: strings.headers.register }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: strings.headers.forgotPassword }}
      />
    </Stack.Navigator>
  );
}
