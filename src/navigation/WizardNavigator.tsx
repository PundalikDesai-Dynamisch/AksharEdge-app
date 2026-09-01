import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';


// We import these screens once they are created. Using a placeholder for now to satisfy TS.
import { ChildIdentityScreen } from '@features/wizard/screens/ChildIdentityScreen';
import { ChildDetailsScreen } from '@features/wizard/screens/ChildDetailsScreen';
import { ConfirmationScreen } from '@features/wizard/screens/ConfirmationScreen';
import { AssessmentPlaceholderScreen } from '@features/wizard/screens/AssessmentPlaceholderScreen';

import type { WizardStackParamList, ParentScreenProps } from './types';

const Stack = createNativeStackNavigator<WizardStackParamList>();

type WizardNavigatorProps = ParentScreenProps<'WizardPlaceholder'>;

export function WizardNavigator({ route }: WizardNavigatorProps): React.JSX.Element {
  // If `childId` is present in the route params, the wizard starts in edit mode.
  // We pass it down to `ChildIdentity` as initial params.
  const { childId } = route.params || {};

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="ChildIdentity" 
        component={ChildIdentityScreen} 
        initialParams={{ childId }}
      />
      <Stack.Screen name="ChildDetails" component={ChildDetailsScreen} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
      <Stack.Screen name="AssessmentPlaceholder" component={AssessmentPlaceholderScreen} />
    </Stack.Navigator>
  );
}
