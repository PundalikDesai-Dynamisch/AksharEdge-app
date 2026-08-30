import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@theme';

interface LoaderProps {
  size?: 'small' | 'large';
  label?: string;
}

export function Loader({ size = 'large', label }: LoaderProps): React.JSX.Element {
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator size={size} color={colors.primary} />
      {label !== undefined && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  // Deliberately not `flex: 1` — the Loader must compose inline (below a title, inside a
  // button row) as well as fill a screen. Whoever wants it centred in a whole screen supplies
  // the flex container; `Screen loading` does exactly that.
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  label: {
    ...typography.bodyMuted,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
