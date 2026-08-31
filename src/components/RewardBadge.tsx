import React from 'react';

import { BADGES } from '@assets/registry';

import type { BadgeType } from '@assets/registry';

interface RewardBadgeProps {
  type: BadgeType;
  size?: number;
  /** Rewards are announced beside their own copy, so label only when it adds meaning. */
  accessibilityLabel?: string;
}

/**
 * An illustrated reward — design.md §8.8.
 *
 * Reads from the asset registry for the same reason `Mascot` does: the commissioned artwork
 * replaces the placeholders as a file drop, with no component or screen changes. Badges are never
 * drawn inline in the overlay.
 */
export function RewardBadge({
  type,
  size = 120,
  accessibilityLabel,
}: RewardBadgeProps): React.JSX.Element {
  const Art = BADGES[type];
  const decorative = accessibilityLabel === undefined;

  return (
    <Art
      width={size}
      height={size}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
    />
  );
}
