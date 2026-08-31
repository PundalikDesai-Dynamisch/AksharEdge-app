import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors, IconName, radii, spacing, typography } from '@theme';

import { Icon } from './Icon';

export interface Step {
  readonly key: string;
  readonly label: string;
}

interface SteppingStonesProps {
  steps: readonly Step[];
  currentIndex: number;
  completedKeys: readonly string[];
}

const STONE = { current: 40, other: 28 } as const;

/**
 * The mission-map progress indicator design.md §8.3 asks for in place of "a generic thin progress
 * bar". One component serves the wizard's 5 steps, Ready to Play's 3-stone roadmap, and the game
 * header's mission path — they differ only in how many stones they are given.
 *
 * Three states per stone: completed carries a tick, current is enlarged and filled, upcoming is
 * visible but quiet. Size and glyph both change, so the states survive being read in greyscale.
 */
export function SteppingStones({
  steps,
  currentIndex,
  completedKeys,
}: SteppingStonesProps): React.JSX.Element {
  return (
    <View
      style={styles.row}
      accessibilityRole="progressbar"
      accessibilityLabel={strings.accessibility.stepProgress(completedKeys.length, steps.length)}
      accessibilityValue={{ min: 0, max: steps.length, now: completedKeys.length }}
    >
      {steps.map((step, index) => {
        const isCompleted = completedKeys.includes(step.key);
        const isCurrent = index === currentIndex && !isCompleted;
        const diameter = isCurrent ? STONE.current : STONE.other;

        return (
          <View key={step.key} style={styles.item}>
            {/* The connector is drawn before each stone but the first, so the path reads as one
                route rather than a row of separate dots. */}
            {index > 0 && (
              <View style={[styles.connector, isCompleted && styles.connectorDone]} />
            )}

            <View style={styles.stack}>
              <View
                style={[
                  styles.stone,
                  { width: diameter, height: diameter, borderRadius: diameter / 2 },
                  isCompleted && styles.stoneDone,
                  isCurrent && styles.stoneCurrent,
                ]}
              >
                {isCompleted ? (
                  <Icon name={IconName.check} size={16} color="textInverse" />
                ) : (
                  <Text style={[styles.index, isCurrent && styles.indexCurrent]}>{index + 1}</Text>
                )}
              </View>

              <Text
                style={[styles.label, isCurrent && styles.labelCurrent]}
                numberOfLines={1}
              >
                {step.label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stack: {
    alignItems: 'center',
    gap: spacing.xs,
    // Keeps every stone's label on the same baseline even though the current stone is taller.
    minHeight: STONE.current + spacing.lg,
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    // Aligns with the centre of the smaller stones rather than the label block.
    marginBottom: spacing.lg,
  },
  connectorDone: {
    backgroundColor: colors.successDeep,
  },
  stone: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  stoneDone: {
    backgroundColor: colors.successDeep,
    borderColor: colors.successDeep,
  },
  stoneCurrent: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primaryDeep,
    borderRadius: radii.pill,
  },
  index: {
    ...typography.caption,
    color: colors.textMuted,
  },
  indexCurrent: {
    ...typography.subtitle,
    color: colors.primaryDeep,
  },
  label: {
    ...typography.caption,
    textAlign: 'center',
  },
  labelCurrent: {
    color: colors.primaryDeep,
  },
});
