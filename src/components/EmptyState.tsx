import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@theme';

import type { IconGlyph } from '@theme';

import { Button } from './Button';
import { Icon } from './Icon';

interface EmptyStateProps {
  icon: IconGlyph;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * The single empty-list presentation for the whole app — no screen writes its own inline
 * "no data" text, so copy and layout stay consistent (doc 18 §6).
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name={icon} size={28} color="primary" />
      </View>

      <Text style={styles.title}>{title}</Text>
      {description !== undefined && <Text style={styles.description}>{description}</Text>}

      {actionLabel !== undefined && onAction !== undefined && (
        <Button label={actionLabel} onPress={onAction} fullWidth={false} style={styles.action} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  iconCircle: {
    width: spacing.xxxl,
    height: spacing.xxxl,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryMuted,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    ...typography.bodyMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  action: {
    marginTop: spacing.xl,
  },
});
