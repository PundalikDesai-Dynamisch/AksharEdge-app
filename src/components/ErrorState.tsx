import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors, IconName, radii, spacing, typography } from '@theme';

import { Button } from './Button';
import { Icon } from './Icon';

interface ErrorStateProps {
  /** Deliberately `string`, never an error object: callers pass AppError.userMessage (doc 04 §8). */
  description: string;
  onRetry: () => void;
  title?: string;
  retryLabel?: string;
}

export function ErrorState({
  description,
  onRetry,
  title = strings.common.somethingWentWrong,
  retryLabel = strings.common.tryAgain,
}: ErrorStateProps): React.JSX.Element {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <View style={styles.iconCircle}>
        <Icon name={IconName.alertCircle} size={28} color="danger" />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <Button
        label={retryLabel}
        onPress={onRetry}
        variant="secondary"
        fullWidth={false}
        style={styles.action}
      />
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
    backgroundColor: colors.dangerMuted,
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
