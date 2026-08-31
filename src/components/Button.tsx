import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { StyleProp, ViewStyle } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@theme';

import type { ColorToken, IconGlyph } from '@theme';

import { Icon } from './Icon';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: IconGlyph;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * design.md §2 sets 56 as the floor for a primary action, and §5 wants every control comfortably
 * above the 44pt touch target. Both sizes clear it on height alone, so no hitSlop is needed.
 */
const HEIGHT = { md: 48, lg: 56 } as const;

interface VariantStyle {
  readonly background: ColorToken;
  readonly foreground: ColorToken;
  readonly border: ColorToken | null;
  /** Filled actions lift off the surface; outlined ones stay flat (design.md §5). */
  readonly raised: boolean;
}

const VARIANTS: Readonly<Record<ButtonVariant, VariantStyle>> = {
  // `primaryDeep`, not `primary`: white on #FF6B4A measures 2.82:1 and fails AA. See colors.ts.
  primary: { background: 'primaryDeep', foreground: 'textInverse', border: null, raised: true },
  secondary: {
    background: 'primaryMuted',
    foreground: 'primaryDeep',
    border: 'primary',
    raised: false,
  },
  ghost: { background: 'surface', foreground: 'primaryDeep', border: 'border', raised: false },
  destructive: { background: 'danger', foreground: 'textInverse', border: null, raised: true },
};

/**
 * Disabled is a recolour, not an opacity wash. design.md §18 forbids communicating state by
 * colour alone, and a dimmed variant still reads as that variant — a faded coral button looks
 * like a coral button in poor light. textMuted on border measures 4.72:1, so the label stays
 * legible rather than becoming decorative grey.
 */
const DISABLED: Pick<VariantStyle, 'background' | 'foreground'> = {
  background: 'border',
  foreground: 'textMuted',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
  style,
}: ButtonProps): React.JSX.Element {
  const tone = VARIANTS[variant];
  const isInert = disabled || loading;

  // `loading` keeps the variant's own colours — the action is still live, merely busy. Only a
  // genuinely disabled control recolours, so the two states never look alike.
  const background = colors[disabled ? DISABLED.background : tone.background];
  const foreground = colors[disabled ? DISABLED.foreground : tone.foreground];
  const outlined = tone.border !== null && !disabled;

  return (
    <Pressable
      onPress={onPress}
      disabled={isInert}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isInert, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        tone.raised && !disabled && shadows.sm,
        {
          backgroundColor: background,
          borderColor: outlined && tone.border !== null ? colors[tone.border] : 'transparent',
          borderWidth: outlined ? StyleSheet.hairlineWidth * 2 : 0,
        },
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={foreground} />
      ) : (
        <View style={styles.content}>
          {icon !== undefined && (
            <Icon
              name={icon}
              size={18}
              color={disabled ? DISABLED.foreground : tone.foreground}
            />
          )}
          <Text style={[styles.label, { color: foreground }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    // design.md §8.1 — pill-shaped, not the 16px radii.md this previously used.
    borderRadius: radii.pill,
    paddingHorizontal: spacing.xl,
  },
  md: {
    minHeight: HEIGHT.md,
  },
  lg: {
    minHeight: HEIGHT.lg,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    ...typography.button,
  },
  pressed: {
    opacity: 0.75,
  },
});
