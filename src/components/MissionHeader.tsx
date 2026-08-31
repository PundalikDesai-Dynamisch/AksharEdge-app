import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors, IconName, radii, spacing } from '@theme';

import { Icon } from './Icon';
import { SteppingStones } from './SteppingStones';

import type { Step } from './SteppingStones';

interface MissionHeaderProps {
  steps: readonly Step[];
  currentIndex: number;
  completedKeys: readonly string[];
  /** The small pause/exit control from spec §20. */
  onExit: () => void;
}

/**
 * The child-facing header shown above a game (spec §20).
 *
 * Kept separate from `WizardHeader` even though both compose `SteppingStones`: the contexts and
 * the controls genuinely differ — pausing out of a game in progress is not "go back one step",
 * and conflating them would put a back arrow on a screen where leaving abandons a round.
 *
 * ⚠️ No timer and no score. design.md §14 forbids both during play — metrics are parent-facing
 * and belong in the report. Do not add them here later "just for debugging".
 */
export function MissionHeader({
  steps,
  currentIndex,
  completedKeys,
  onExit,
}: MissionHeaderProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.stones}>
        <SteppingStones
          steps={steps}
          currentIndex={currentIndex}
          completedKeys={completedKeys}
        />
      </View>

      <Pressable
        onPress={onExit}
        hitSlop={spacing.md}
        accessibilityRole="button"
        accessibilityLabel={strings.accessibility.pauseAndExit}
        style={styles.exit}
      >
        <Icon name={IconName.pause} size={20} color="text" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  stones: {
    flex: 1,
  },
  exit: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
});
