import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { StyleProp, ViewStyle } from 'react-native';

import { MIN_TOUCH_TARGET } from '@/constants/config';
import { colors, radii, spacing, typography } from '@theme';

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

interface VariantStyle {
  readonly background: ColorToken;
  readonly foreground: ColorToken;
  readonly border: ColorToken | null;
}

const VARIANTS: Readonly<Record<ButtonVariant, VariantStyle>> = {
  primary: { background: 'primary', foreground: 'textInverse', border: null },
  secondary: { background: 'primaryMuted', foreground: 'primary', border: 'primary' },
  ghost: { background: 'surface', foreground: 'primary', border: 'border' },
  destructive: { background: 'danger', foreground: 'textInverse', border: null },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
  style,
}: ButtonProps): React.JSX.Element {
  const tone = VARIANTS[variant];
  const isInert = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isInert}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isInert, busy: loading }}
      // Guarantees the 44pt target even when the visual height is the smaller `md` size (NFR-9).
      hitSlop={size === 'md' ? spacing.xs : 0}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        {
          backgroundColor: colors[tone.background],
          borderColor: tone.border === null ? 'transparent' : colors[tone.border],
          borderWidth: tone.border === null ? 0 : StyleSheet.hairlineWidth * 2,
        },
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        isInert && styles.inert,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors[tone.foreground]} />
      ) : (
        <View style={styles.content}>
          {icon !== undefined && <Icon name={icon} size={18} color={tone.foreground} />}
          <Text style={[styles.label, { color: colors[tone.foreground] }]} numberOfLines={1}>
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
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
  },
  md: {
    minHeight: 40,
  },
  lg: {
    minHeight: MIN_TOUCH_TARGET + spacing.xs,
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
  inert: {
    opacity: 0.5,
  },
});
