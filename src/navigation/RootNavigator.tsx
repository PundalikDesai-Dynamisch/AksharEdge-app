import React from 'react';

import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { Theme } from '@react-navigation/native';

import SplashScreen from '@features/auth/screens/SplashScreen';
import { useAppSelector } from '@store/hooks';
import { colors } from '@theme';

import type { RootStackParamList } from './types';

import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';
import { linking } from './linking';
import { navigationRef } from './navigationRef';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};

/**
 * Swapping the mounted navigator on `authStatus` — rather than navigating between stacks —
 * means there is no back-navigation from the app into the auth flow, and sign-out unmounts
 * the whole app stack in one state change (doc 06 §1).
 */
export function RootNavigator(): React.JSX.Element {
  const status = useAppSelector(state => state.auth.status);

  return (
    <NavigationContainer ref={navigationRef} linking={linking} theme={navTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {status === 'unknown' && <RootStack.Screen name="Splash" component={SplashScreen} />}
        {status === 'signedOut' && <RootStack.Screen name="Auth" component={AuthNavigator} />}
        {status === 'signedIn' && <RootStack.Screen name="App" component={AppNavigator} />}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
