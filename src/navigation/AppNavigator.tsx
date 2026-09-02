import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UnityGameScreen from '@features/games/screens/UnityGameScreen';
import { MissionIntroScreen } from '@features/games/screens/MissionIntroScreen';
import GalleryScreen from '@features/dev/screens/GalleryScreen';

import { ParentNavigator } from './ParentNavigator';

import type { AppStackParamList } from './types';

import { defaultStackOptions } from './screenOptions';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={defaultStackOptions}>
      <Stack.Screen name="Parent" component={ParentNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="MissionIntro" component={MissionIntroScreen} options={{ headerShown: false }} />
      
      <Stack.Screen name="UnityGame" component={UnityGameScreen} options={{ headerShown: false }} />

      {/* Phase 1's component gallery.
          `__DEV__` is inlined to `false` in a release bundle, so this route is never registered
          and the gallery is unreachable — verified by grepping a `--dev false` bundle: 0 matches
          for the route name.
          It is NOT stripped from the bundle, however. Metro does not tree-shake the top-level
          import above just because its only use sits behind a dead branch, so the screen's code
          still ships as a few unreachable KB. That is a size cost, not a reachability hole. */}
      {__DEV__ && <Stack.Screen name="Gallery" component={GalleryScreen} options={{ title: 'Gallery' }} />}
    </Stack.Navigator>
  );
}
