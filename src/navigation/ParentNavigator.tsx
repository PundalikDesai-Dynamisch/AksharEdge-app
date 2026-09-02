import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ParentHomeScreen from '@features/parent/screens/ParentHomeScreen';
import AllChildrenScreen from '@features/parent/screens/AllChildrenScreen';
import ParentDetailsScreen from '@features/parent/screens/ParentDetailsScreen';
import SupportScreen from '@features/parent/screens/SupportScreen';

import { defaultStackOptions } from './screenOptions';
import type { ParentStackParamList } from './types';
import { WizardNavigator } from './WizardNavigator';
import { ChildNavigator } from './ChildNavigator';

const Stack = createNativeStackNavigator<ParentStackParamList>();

export function ParentNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={defaultStackOptions}>
      <Stack.Screen 
        name="ParentHome" 
        component={ParentHomeScreen} 
        options={{ headerShown: false }} 
      />
      {/* 
        The nested wizard flow. Keeps the name 'WizardPlaceholder' so existing
        navigation callers in ParentHome and AllChildren remain unaffected.
      */}
      <Stack.Screen 
        name="WizardPlaceholder" 
        component={WizardNavigator} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ChildTabs" 
        component={ChildNavigator} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="AllChildren" 
        component={AllChildrenScreen} 
        options={{ title: 'All Children' }} 
      />
      <Stack.Screen 
        name="ParentDetails" 
        component={ParentDetailsScreen} 
        options={{ title: 'Parent Profile' }} 
      />
      <Stack.Screen 
        name="Support" 
        component={SupportScreen} 
        options={{ title: 'Support', headerShown: false }} 
      />
    </Stack.Navigator>
  );
}
