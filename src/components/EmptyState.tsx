import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@theme';

import type { IconGlyph } from '@theme';

import { Button } from './Button';
import { Icon } from './Icon';

interface EmptyStateProps {
  title: string;
  icon?: IconGlyph;
  /**
   * An illustration slot for design.md §8.6 — normally a `<Mascot />`. Takes precedence over
   * `icon` when both are supplied. Deliberately a ReactNode rather than a mascot pose name:
   * importing Mascot here would invert the dependency and couple this component to the asset
   * registry, so the screen passes the element in instead.
   */
  illustration?: React.ReactNode;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * The single empty-list presentation for the whole app — no screen writes its own inline
 * "no data" text, so copy and layout stay consistent (doc 18 §6).
 */
export function EmptyState({
  title,
  icon,
  illustration,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {illustration !== undefined ? (
        <View style={styles.illustration}>{illustration}</View>
      ) : (
        icon !== undefined && (
          <View style={styles.iconCircle}>
            {/* `primaryDeep`, not `primary`: coral on primaryMuted is 2.50:1 and misses the
                3:1 floor for an icon that carries meaning. */}
            <Icon name={icon} size={28} color="primaryDeep" />
          </View>
        )
      )}

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
  illustration: {
    marginBottom: spacing.lg,
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
