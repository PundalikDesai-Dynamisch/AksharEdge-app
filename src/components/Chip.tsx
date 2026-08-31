import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@theme';

import type { ColorToken, IconGlyph } from '@theme';

import { Icon } from './Icon';

export type ChipTone = 'neutral' | 'warning' | 'danger' | 'success' | 'info';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  tone?: ChipTone;
  /** Pairs a glyph with the tone so status never rests on colour alone (design.md §18). */
  icon?: IconGlyph;
}

/** Foregrounds are the `*Deep` variants: the base colours are fills, and base-on-muted is not
 *  legible as text (success on successMuted measures 1.65:1). */
const TONES: Readonly<Record<ChipTone, { fg: ColorToken; bg: ColorToken }>> = {
  neutral: { fg: 'textMuted', bg: 'surface' },
  warning: { fg: 'warningDeep', bg: 'warningMuted' },
  danger: { fg: 'dangerDeep', bg: 'dangerMuted' },
  success: { fg: 'successDeep', bg: 'successMuted' },
  info: { fg: 'infoDeep', bg: 'infoMuted' },
};

export function Chip({
  label,
  selected = false,
  onPress,
  tone = 'neutral',
  icon,
}: ChipProps): React.JSX.Element {
  const palette = TONES[tone];
  const foregroundToken: ColorToken = selected ? 'textInverse' : palette.fg;
  const foreground = colors[foregroundToken];
  const background = selected ? colors.primaryDeep : colors[palette.bg];

  const body = (
    <View style={[styles.chip, { backgroundColor: background }]}>
      {icon !== undefined && <Icon name={icon} size={14} color={foregroundToken} />}
      <Text style={[styles.label, { color: foreground }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );

  if (onPress === undefined) {
    return body;
  }

  return (
    <Pressable
      onPress={onPress}
      hitSlop={spacing.sm}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    ...typography.caption,
  },
});
