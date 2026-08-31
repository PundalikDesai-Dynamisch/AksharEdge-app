import type { TextStyle } from 'react-native';

import { colors } from './colors';

/**
 * design.md §6: headings 24–32, child-facing reading text 16–18 minimum, parent/settings UI
 * 14–16, line height roughly 1.4–1.6. Headings sit at the tighter end of that range because a
 * 32px display line at 1.5 reads as loose rather than generous.
 *
 * `fontFamily` is deliberately absent: naming Baloo 2 or Nunito before the fonts are registered
 * fails SILENTLY to the system face, which looks like a styling bug rather than a missing asset.
 * phase-0/assets-pipeline registers them and sets the families here.
 *
 * Typed as TextStyle so `fontWeight` narrows to React Native's accepted union rather than the
 * wider `string` a bare `as const` object would infer.
 */
export const typography = {
  displayLarge: { fontSize: 32, fontWeight: '800', lineHeight: 40 },
  displaySmall: { fontSize: 26, fontWeight: '700', lineHeight: 34 },
  title: { fontSize: 22, fontWeight: '700', lineHeight: 30 },
  subtitle: { fontSize: 18, fontWeight: '600', lineHeight: 26 },
  /** Child-facing reading text — design.md §6 sets 16 as the floor. */
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyMuted: { fontSize: 15, fontWeight: '400', lineHeight: 23, color: colors.textMuted },
  caption: { fontSize: 13, fontWeight: '400', lineHeight: 18, color: colors.textMuted },
  button: { fontSize: 17, fontWeight: '600', lineHeight: 22 },
} satisfies Record<string, TextStyle>;

export type TypographyToken = keyof typeof typography;
