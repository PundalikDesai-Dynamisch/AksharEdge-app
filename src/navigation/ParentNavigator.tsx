import React from 'react';
import { Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ParentHomeScreen from '@features/parent/screens/ParentHomeScreen';
import { Screen, Icon } from '@components';
import { defaultStackOptions } from './screenOptions';
import { typography, spacing, colors } from '@theme';

import type { ParentStackParamList } from './types';

const Stack = createNativeStackNavigator<ParentStackParamList>();

// Placeholders for screens not built in Phase 2
const Placeholder = ({ title }: { title: string }) => (
  <Screen>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl }}>
      <Icon name="info" size={48} color="primary" />
      <Text style={{ ...typography.displaySmall, color: colors.text, marginTop: spacing.md, textAlign: 'center' }}>
        {title}
      </Text>
      <Text style={{ ...typography.body, color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' }}>
        This screen will be built in a future phase.
      </Text>
    </View>
  </Screen>
);

const WizardPlaceholder = () => <Placeholder title="Create Child Wizard" />;
const AllChildrenPlaceholder = () => <Placeholder title="All Children" />;
const ParentDetailsPlaceholder = () => <Placeholder title="Edit Parent Details" />;
const SupportPlaceholder = () => <Placeholder title="Support" />;

export function ParentNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={defaultStackOptions}>
      <Stack.Screen 
        name="ParentHome" 
        component={ParentHomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="WizardPlaceholder" 
        component={WizardPlaceholder} 
        options={{ title: 'Add Child' }} 
      />
      <Stack.Screen 
        name="AllChildrenPlaceholder" 
        component={AllChildrenPlaceholder} 
        options={{ title: 'All Children' }} 
      />
      <Stack.Screen 
        name="ParentDetailsPlaceholder" 
        component={ParentDetailsPlaceholder} 
        options={{ title: 'Parent Profile' }} 
      />
      <Stack.Screen 
        name="SupportPlaceholder" 
        component={SupportPlaceholder} 
        options={{ title: 'Support' }} 
      />
    </Stack.Navigator>
  );
}
