import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Icon } from '@components';
import { strings } from '@/constants/strings';
import ParentHomeScreen from '@features/parent/screens/ParentHomeScreen';
import { GamesScreen } from '@features/games/screens/GamesScreen';
import { UnityGameScreen } from '@features/games/screens/UnityGameScreen';

import { IconName } from '@theme';

import type { IconGlyph } from '@theme';

import type { AppStackParamList, MainTabsParamList } from './types';

import { defaultStackOptions, defaultTabOptions } from './screenOptions';

const Tabs = createBottomTabNavigator<MainTabsParamList>();
const Stack = createNativeStackNavigator<AppStackParamList>();

function tabIcon(glyph: IconGlyph) {
  return function TabIcon({ focused }: { focused: boolean }): React.JSX.Element {
    return <Icon name={glyph} size={22} color={focused ? 'primary' : 'textMuted'} />;
  };
}

/**
 * Transitional shell. The teacher-era tabs (Dashboard, Students, History, Settings) are gone;
 * Phase 2 replaces this with the parent-level navigation defined in AKSHAREDGE_SCREENS_SPEC.md
 * §7 — Add / All Children / Parent / Support.
 *
 * GamesTab is retained deliberately: the embedded Unity 2D runner stands in as the interim
 * assessment game until real game code exists, so this is a real route into the product rather
 * than dev scaffolding. Phase 4 drives it from the assessment flow instead of a synthetic stub.
 */
function MainTabs(): React.JSX.Element {
  return (
    <Tabs.Navigator screenOptions={defaultTabOptions}>
      <Tabs.Screen
        name="HomeTab"
        component={ParentHomeScreen}
        options={{ title: strings.headers.home, tabBarIcon: tabIcon(IconName.home) }}
      />
      <Tabs.Screen
        name="GamesTab"
        component={GamesScreen}
        options={{ title: strings.headers.games, tabBarIcon: tabIcon(IconName.gamepad) }}
      />
    </Tabs.Navigator>
  );
}

export function AppNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator initialRouteName="MainTabs" screenOptions={defaultStackOptions}>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="UnityGame" component={UnityGameScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
