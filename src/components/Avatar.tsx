import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AVATARS } from '@assets/registry';
import { colors, IconName, radii } from '@theme';

import type { AvatarId } from '@/types/models';

import { Icon } from './Icon';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  avatarId: AvatarId;
  /** A token for the three standard placements, or an explicit number for a one-off. */
  size?: AvatarSize | number;
  /** The child's name, so a screen reader announces who this is rather than "image". */
  name?: string;
  /** Draws the picker's selection affordance. */
  selected?: boolean;
}

/** list row · card · profile header — design.md §8.4. */
const SIZES: Readonly<Record<AvatarSize, number>> = { sm: 40, md: 64, lg: 96 };

/** The badge is a fixed fraction of the avatar so it stays proportionate at every size. */
const BADGE_RATIO = 0.34;

/**
 * An illustrated child avatar. design.md §7 forbids photographic child imagery outright, so this
 * component takes an id into a fixed illustrated set and never a URL — and `AvatarId` makes a
 * wrong id a compile error rather than a blank square. Untrusted values are already collapsed to
 * the default at the Firestore boundary (`entityMappers.toChild`), so there is nothing left to
 * defend against here.
 */
export function Avatar({
  avatarId,
  size = 'md',
  name,
  selected = false,
}: AvatarProps): React.JSX.Element {
  const Art = AVATARS[avatarId];
  const px = typeof size === 'number' ? size : SIZES[size];
  const badge = Math.round(px * BADGE_RATIO);

  return (
    <View style={[styles.container, { width: px, height: px }]}>
      <View
        style={[
          styles.art,
          selected && styles.artSelected,
          { borderRadius: px / 2 },
        ]}
      >
        <Art width={px} height={px} accessibilityRole="image" accessibilityLabel={name} />
      </View>

      {/* design.md §18: selection may not be communicated by the ring's colour alone, so the
          check badge carries the same meaning in shape. */}
      {selected && (
        <View
          style={[
            styles.badge,
            { width: badge, height: badge, borderRadius: badge / 2 },
          ]}
        >
          <Icon name={IconName.check} size={Math.round(badge * 0.62)} color="textInverse" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  art: {
    overflow: 'hidden',
  },
  artSelected: {
    borderWidth: 3,
    borderColor: colors.primaryDeep,
  },
  badge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDeep,
    borderWidth: 2,
    borderColor: colors.surface,
    borderRadius: radii.pill,
  },
});
