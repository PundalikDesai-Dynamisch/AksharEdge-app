import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@components';
import { strings } from '@/constants/strings';

import { colors, spacing, typography } from '@theme';

/**
 * Placeholder so the app stays bootable while the teacher-era screens are removed.
 *
 * Phase 2 (`phase-2/parent-home`) replaces this entirely with the real two-state Parent Home —
 * the onboarding carousel when the parent has no children, the child list when they do — fed by
 * a live Firestore subscription. Nothing here is meant to survive that.
 */
export default function ParentHomeScreen(): React.JSX.Element {
  return (
    <Screen>
      <View style={styles.body}>
        <Text style={styles.title}>{strings.app.name}</Text>
        <Text style={styles.subtitle}>{strings.app.welcomeSubtitle}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.displayLarge,
    color: colors.primary,
  },
  subtitle: {
    ...typography.bodyMuted,
    textAlign: 'center',
  },
});
