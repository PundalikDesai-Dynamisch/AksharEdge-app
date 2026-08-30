import React from 'react';

// The `/static` entry point, not the package root: the root's dynamic font loader requires
// expo-font, which a bare RN CLI project does not have (doc 03 §2 — never Expo). Static means
// the font is registered natively — Android via the package's own gradle copyFonts task,
// iOS via UIAppFonts in Info.plist, written by the `rnvi-update-plist` postinstall hook.
import { Feather } from '@react-native-vector-icons/feather/static';

import { colors } from '@theme';

import type { ColorToken, IconGlyph } from '@theme';

/**
 * The only module in `src/` that imports the icon library. Everything else names icons
 * through IconName and colours through ColorToken, so swapping icon sets is a one-file
 * change (doc 18 §7).
 */
interface IconProps {
  name: IconGlyph;
  size?: number;
  color?: ColorToken;
}

export function Icon({ name, size = 20, color = 'text' }: IconProps): React.JSX.Element {
  return <Feather name={name} size={size} color={colors[color]} />;
}
