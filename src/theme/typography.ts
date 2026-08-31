import type { TextStyle } from 'react-native';

import { colors } from './colors';
import { fonts } from './fonts';

/**
 * design.md §6: headings 24–32, child-facing reading text 16–18 minimum, parent/settings UI
 * 14–16, line height roughly 1.4–1.6. Headings sit at the tighter end of that range because a
 * 32px display line at 1.5 reads as loose rather than generous.
 *
 * Weight is carried by `fontFamily`, not `fontWeight`. These families ship one file per weight
 * with distinct family names, so `fontWeight` cannot select between them — see theme/fonts.ts.
 * Pairing the two would invite synthetic bolding on an already-bold face.
 *
 * Typed as TextStyle so `fontWeight` narrows to React Native's accepted union rather than the
 * wider `string` a bare `as const` object would infer.
 */
export const typography = {
  displayLarge: { fontFamily: fonts.headingExtraBold, fontSize: 32, lineHeight: 40 },
  displaySmall: { fontFamily: fonts.headingBold, fontSize: 26, lineHeight: 34 },
  title: { fontFamily: fonts.headingBold, fontSize: 22, lineHeight: 30 },
  subtitle: { fontFamily: fonts.headingSemiBold, fontSize: 18, lineHeight: 26 },
  /** Child-facing reading text — design.md §6 sets 16 as the floor. */
  body: { fontFamily: fonts.bodyRegular, fontSize: 16, lineHeight: 24 },
  bodyMuted: {
    fontFamily: fonts.bodyRegular,
    fontSize: 15,
    lineHeight: 23,
    color: colors.textMuted,
  },
  caption: {
    fontFamily: fonts.bodyRegular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  button: { fontFamily: fonts.bodySemiBold, fontSize: 17, lineHeight: 22 },
} satisfies Record<string, TextStyle>;

export type TypographyToken = keyof typeof typography;
