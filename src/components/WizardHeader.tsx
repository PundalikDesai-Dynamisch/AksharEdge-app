import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors, IconName, spacing, typography } from '@theme';

import { Icon } from './Icon';
import { SteppingStones } from './SteppingStones';

import type { Step } from './SteppingStones';

interface WizardHeaderProps {
  steps: readonly Step[];
  currentIndex: number;
  completedKeys: readonly string[];
  title?: string;
  /**
   * Omitted on the first step. design.md §8.10 asks for a back affordance on every step *after*
   * the first — so the control is absent there, never present-but-disabled: an inert control that
   * still looks tappable is worse than no control at all.
   */
  onBack?: () => void;
}

/** The persistent header for the child-creation wizard (design.md §8.10, spec §11–§17). */
export function WizardHeader({
  steps,
  currentIndex,
  completedKeys,
  title,
  onBack,
}: WizardHeaderProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        {onBack !== undefined && (
          <Pressable
            onPress={onBack}
            hitSlop={spacing.md}
            accessibilityRole="button"
            accessibilityLabel={strings.accessibility.goBack}
          >
            <Icon name={IconName.arrowLeft} size={24} color="text" />
          </Pressable>
        )}

        {title !== undefined && (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>

      <SteppingStones
        steps={steps}
        currentIndex={currentIndex}
        completedKeys={completedKeys}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    paddingVertical: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: spacing.xxl,
  },
  title: {
    ...typography.title,
    color: colors.text,
    flexShrink: 1,
  },
});
