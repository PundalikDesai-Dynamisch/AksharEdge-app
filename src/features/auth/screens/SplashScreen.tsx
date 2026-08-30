import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@components';
import { strings } from '@/constants/strings';
import { setAuthState } from '@features/auth/auth.slice';
import { useAppDispatch } from '@store/hooks';
import { colors, spacing, typography } from '@theme';

/**
 * Holds the UI while bootstrap.ts runs and decides the first stack (doc 07 §1).
 *
 * From Phase 1 on, the real `onAuthStateChanged` listener in bootstrap.ts transitions auth
 * status. The 2-second fallback below is a safety net — if bootstrap hasn't fired by then,
 * drop the teacher to the auth flow rather than stranding them on the splash screen forever.
 */
export default function SplashScreen(): React.JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setAuthState({ status: 'signedOut', teacher: null }));
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <Screen>
      <View style={styles.centre}>
        <Text style={styles.name}>{strings.app.name}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  name: {
    ...typography.displayLarge,
    color: colors.primary,
  },
});
