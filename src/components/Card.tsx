import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { StyleProp, ViewStyle } from 'react-native';

import { colors, radii, spacing } from '@theme';

interface CardProps {
  children: React.ReactNode;
  padded?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  padded = true,
  onPress,
  accessibilityLabel,
  style,
}: CardProps): React.JSX.Element {
  const base = [styles.card, padded && styles.padded, style];

  if (onPress === undefined) {
    return <View style={base}>{children}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [...base, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.lg,
  },
  padded: {
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.75,
  },
});
