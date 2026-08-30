import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OFFLINE_INDICATOR } from '@/constants/config';
import { strings } from '@/constants/strings';
import { colors, spacing, typography } from '@theme';

import { Icon } from './Icon';

interface OfflineBannerProps {
  visible: boolean;
  pendingCount?: number;
}

export function OfflineBanner({
  visible,
  pendingCount = 0,
}: OfflineBannerProps): React.JSX.Element | null {
  if (!visible) {
    return null;
  }

  const message =
    pendingCount > 0 ? strings.network.offlineWithPending(pendingCount) : strings.network.offline;

  return (
    <View
      style={[styles.banner, { backgroundColor: colors[OFFLINE_INDICATOR.bg] }]}
      accessibilityLiveRegion="polite"
    >
      <Icon name={OFFLINE_INDICATOR.icon} size={16} color={OFFLINE_INDICATOR.fg} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  message: {
    ...typography.bodyMuted,
    flexShrink: 1,
  },
});
