import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { StyleProp, ViewStyle } from 'react-native';

import { colors, radii, shadows, spacing } from '@theme';

import type { ColorToken } from '@theme';

type CardTone = 'plain' | 'sky' | 'accent';

interface CardProps {
  children: React.ReactNode;
  padded?: boolean;
  tone?: CardTone;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * `sky` exists for design.md §17's "Recommended Next Steps" card, which must read as calm
 * guidance rather than a result; `accent` for §8.8's reward surfaces. Everything else is `plain`
 * — the tones are deliberately few so a tinted card always means something.
 */
const TONES: Readonly<Record<CardTone, ColorToken>> = {
  plain: 'surface',
  sky: 'secondaryMuted',
  accent: 'accentMuted',
};

export function Card({
  children,
  padded = true,
  tone = 'plain',
  onPress,
  accessibilityLabel,
  style,
}: CardProps): React.JSX.Element {
  const base = [
    styles.card,
    { backgroundColor: colors[TONES[tone]] },
    padded && styles.padded,
    style,
  ];

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
    // design.md §5: soft drop shadow and light elevation, not a hard 1px border — "avoid harsh
    // borders and rigid geometric decoration". The border this replaced was the only thing
    // separating a card from its background, so the shadow is load-bearing, not decoration.
    ...shadows.sm,
    borderRadius: radii.lg,
  },
  padded: {
    padding: spacing.lg,
  },
  pressed: {
    ...shadows.md,
    opacity: 0.9,
  },
});
