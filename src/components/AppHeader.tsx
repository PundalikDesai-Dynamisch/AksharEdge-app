import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@theme';

import type { IconGlyph } from '@theme';

import { Icon } from './Icon';

interface HeaderAction {
  icon: IconGlyph;
  accessibilityLabel: string;
  onPress: () => void;
}

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  action?: HeaderAction;
}

/**
 * An in-content header for screens that draw their own (Dashboard's greeting block, the
 * UploadOptions sheet). Navigator-supplied headers stay the default everywhere else —
 * doc 18 §3 gives no contract for this component, so its API is kept deliberately narrow.
 */
export function AppHeader({ title, subtitle, action }: AppHeaderProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.titleBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle !== undefined && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {action !== undefined && (
        <Pressable
          onPress={action.onPress}
          hitSlop={spacing.md}
          accessibilityRole="button"
          accessibilityLabel={action.accessibilityLabel}
        >
          <Icon name={action.icon} size={22} color="text" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  titleBlock: {
    flexShrink: 1,
  },
  title: {
    ...typography.displayLarge,
    color: colors.text,
  },
  subtitle: {
    ...typography.bodyMuted,
    marginTop: spacing.xs,
  },
});
