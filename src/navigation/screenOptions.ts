import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { colors, typography } from '@theme';

/** doc 06 §9 — the presentation defaults every screen is composed from. */

const sharedHeader = {
  headerShadowVisible: false,
  headerTitleAlign: 'left',
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
  },
} as const;

export const defaultStackOptions: NativeStackNavigationOptions = {
  ...sharedHeader,
  contentStyle: { backgroundColor: colors.background },
  animation: 'slide_from_right',
};

/**
 * Separate from `defaultStackOptions` because the two navigators' option types are not
 * interchangeable — `header` takes different props in each, so spreading one into the other
 * does not type-check.
 */
export const defaultTabOptions: BottomTabNavigationOptions = {
  ...sharedHeader,
  sceneStyle: { backgroundColor: colors.background },
  // Blurred tabs stop re-rendering, which matters once the counters go live (doc 06 §10).
  freezeOnBlur: true,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textMuted,
  tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
};

export const modalOptions: NativeStackNavigationOptions = {
  presentation: 'transparentModal',
  animation: 'fade',
  headerShown: false,
};

export const fullScreenModalOptions: NativeStackNavigationOptions = {
  presentation: 'fullScreenModal',
  animation: 'slide_from_bottom',
  // Prevents an accidental swipe from discarding captured-but-not-yet-queued files (doc 06 §8).
  gestureEnabled: false,
};
