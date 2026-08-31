import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TOAST_DURATION_MS } from '@/constants/config';
import { colors, IconName, radii, spacing, typography } from '@theme';

import type { ColorToken, IconGlyph } from '@theme';
import type { ToastKind } from '@/types/models';

import { Icon } from './Icon';

interface ToastProps {
  kind: ToastKind;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
  /**
   * Not in doc 18 §3's contract, but `duration` is meaningless without a way to report the
   * timeout — the app root uses this to clear `ui.slice.toast`.
   */
  onDismiss?: () => void;
}

const KIND_STYLE: Readonly<Record<ToastKind, { fg: ColorToken; bg: ColorToken; icon: IconGlyph }>> =
  {
    success: { fg: 'successDeep', bg: 'successMuted', icon: IconName.checkCircle },
    info: { fg: 'infoDeep', bg: 'infoMuted', icon: IconName.info },
    warning: { fg: 'warningDeep', bg: 'warningMuted', icon: IconName.alertCircle },
    error: { fg: 'dangerDeep', bg: 'dangerMuted', icon: IconName.alertCircle },
  };

export function Toast({
  kind,
  message,
  actionLabel,
  onAction,
  duration,
  onDismiss,
}: ToastProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const tone = KIND_STYLE[kind];
  const timeout = duration ?? TOAST_DURATION_MS[kind];

  useEffect(() => {
    if (onDismiss === undefined) {
      return undefined;
    }
    const handle = setTimeout(onDismiss, timeout);
    return () => clearTimeout(handle);
  }, [onDismiss, timeout, message]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[tone.bg], bottom: insets.bottom + spacing.xl },
      ]}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
    >
      <Icon name={tone.icon} size={18} color={tone.fg} />

      <Text style={[styles.message, { color: colors[tone.fg] }]} numberOfLines={3}>
        {message}
      </Text>

      {actionLabel !== undefined && onAction !== undefined && (
        <Pressable
          onPress={onAction}
          hitSlop={spacing.md}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={[styles.action, { color: colors[tone.fg] }]}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  message: {
    ...typography.body,
    flex: 1,
  },
  action: {
    ...typography.button,
  },
});
