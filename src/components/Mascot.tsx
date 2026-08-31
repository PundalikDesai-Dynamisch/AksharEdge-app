import React from 'react';

import { MASCOTS } from '@assets/registry';

import type { MascotPose } from '@assets/registry';

interface MascotProps {
  pose: MascotPose;
  size?: number;
  /** Mascots are decorative beside their own copy; label them only when they carry meaning. */
  accessibilityLabel?: string;
}

/**
 * Renders an illustrated mascot by pose name.
 *
 * Screens never reference a file path, so swapping the placeholders for the commissioned
 * artwork is a file drop in `src/assets/mascots/` with no screen changes.
 */
export function Mascot({ pose, size = 160, accessibilityLabel }: MascotProps): React.JSX.Element {
  const Art = MASCOTS[pose];
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
