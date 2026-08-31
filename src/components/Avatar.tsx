import React from 'react';

import { AVATARS, DEFAULT_AVATAR_ID } from '@assets/registry';

import type { AvatarId } from '@assets/registry';

interface AvatarProps {
  avatarId: string;
  size?: number;
  /** The child's name, so a screen reader announces who this is rather than "image". */
  accessibilityLabel?: string;
}

function isKnownAvatar(id: string): id is AvatarId {
  return Object.prototype.hasOwnProperty.call(AVATARS, id);
}

/**
 * An illustrated child avatar. design.md §7 forbids photographic child imagery outright, so
 * this component takes an id into a fixed illustrated set and never a URL.
 *
 * An unrecognised id falls back to the default rather than rendering nothing — a profile card
 * with a missing face reads as a bug to a parent.
 */
export function Avatar({ avatarId, size = 64, accessibilityLabel }: AvatarProps): React.JSX.Element {
  const resolved = isKnownAvatar(avatarId) ? avatarId : DEFAULT_AVATAR_ID;
  const Art = AVATARS[resolved];

  return (
    <Art
      width={size}
      height={size}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    />
  );
}
