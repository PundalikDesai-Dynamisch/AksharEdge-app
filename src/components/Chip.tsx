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

const TONES: Readonly<Record<ChipTone, { fg: ColorToken; bg: ColorToken }>> = {
  neutral: { fg: 'textMuted', bg: 'surface' },
  warning: { fg: 'warning', bg: 'warningMuted' },
  danger: { fg: 'danger', bg: 'dangerMuted' },
  success: { fg: 'success', bg: 'successMuted' },
  info: { fg: 'info', bg: 'infoMuted' },
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
