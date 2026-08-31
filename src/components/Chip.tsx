import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@theme';

import type { ColorToken } from '@theme';

type ChipTone = 'neutral' | 'warning' | 'danger' | 'success' | 'info';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  tone?: ChipTone;
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
}: ChipProps): React.JSX.Element {
  const palette = TONES[tone];
  const foreground = selected ? colors.textInverse : colors[palette.fg];
  const background = selected ? colors.primary : colors[palette.bg];

  const body = (
    <View style={[styles.chip, { backgroundColor: background }]}>
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
