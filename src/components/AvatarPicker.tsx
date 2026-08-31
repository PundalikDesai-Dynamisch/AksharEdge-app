import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AVATAR_IDS } from '@assets/registry';
import { strings } from '@/constants/strings';
import { radii, spacing } from '@theme';

import type { AvatarId } from '@/types/models';

import { Avatar } from './Avatar';

interface AvatarPickerProps {
  value: AvatarId;
  onChange: (avatarId: AvatarId) => void;
  /** Overrides the group label a screen reader announces before the options. */
  accessibilityLabel?: string;
}

/**
 * The illustrated avatar chooser for the wizard's Child Identity step (spec §11).
 *
 * It lives in `src/components/` rather than inside the wizard because Edit Child reuses it, and
 * because design.md §7's "illustration, never photography" rule is easier to hold when there is
 * exactly one way to choose a face.
 *
 * Presentation only: it takes the selected id and a callback, so the wizard slice owns the state
 * and this stays renderable in a test with literal props.
 */
export function AvatarPicker({
  value,
  onChange,
  accessibilityLabel = strings.accessibility.avatarGroup,
}: AvatarPickerProps): React.JSX.Element {
  return (
    <View
      style={styles.grid}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
    >
      {AVATAR_IDS.map((avatarId, index) => {
        const selected = avatarId === value;

        return (
          <Pressable
            key={avatarId}
            onPress={() => onChange(avatarId)}
            accessibilityRole="radio"
            accessibilityLabel={strings.accessibility.avatarOption(index + 1)}
            accessibilityState={{ selected }}
            style={({ pressed }) => [styles.option, pressed && styles.pressed]}
          >
            <Avatar avatarId={avatarId} size="md" selected={selected} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  // A 64pt avatar inside 4pt of padding clears the 44pt target comfortably, and the padding is
  // what the pressed state paints so the tap reads as landing on the option, not the artwork.
  option: {
    padding: spacing.xs,
    borderRadius: radii.pill,
  },
  pressed: {
    opacity: 0.7,
  },
});
