import React from 'react';

import { MASCOTS } from '@assets/registry';

import type { MascotPose } from '@assets/registry';

type MascotSize = 'sm' | 'md' | 'lg';

interface MascotProps {
  pose: MascotPose;
  /** A token for the standard placements, or an explicit number for a one-off. */
  size?: MascotSize | number;
  /** Mascots are decorative beside their own copy; label them only when they carry meaning. */
  accessibilityLabel?: string;
}

/** dialog/inline · screen hero · full-screen celebration. `md` matches the previous default. */
const SIZES: Readonly<Record<MascotSize, number>> = { sm: 96, md: 160, lg: 220 };

/**
 * Renders an illustrated mascot by pose name.
 *
 * Screens never reference a file path, so swapping the placeholders for the commissioned
 * artwork is a file drop in `src/assets/mascots/` with no screen changes.
 */
export function Mascot({
  pose,
  size = 'md',
  accessibilityLabel,
}: MascotProps): React.JSX.Element {
  const Art = MASCOTS[pose];
  const decorative = accessibilityLabel === undefined;
  const px = typeof size === 'number' ? size : SIZES[size];

  return (
    <Art
      width={px}
      height={px}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
    />
  );
}
