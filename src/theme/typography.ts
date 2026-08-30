import type { TextStyle } from 'react-native';

import { colors } from './colors';

/**
 * Typed as TextStyle so `fontWeight` narrows to React Native's accepted union rather than
 * the wider `string` a bare `as const` object would infer.
 */
export const typography = {
  displayLarge: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  displaySmall: { fontSize: 22, fontWeight: '700', lineHeight: 28 },
  title: { fontSize: 20, fontWeight: '600', lineHeight: 26 },
  subtitle: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 21 },
  bodyMuted: { fontSize: 14, fontWeight: '400', lineHeight: 20, color: colors.textMuted },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16, color: colors.textMuted },
  button: { fontSize: 16, fontWeight: '600', lineHeight: 20 },
} satisfies Record<string, TextStyle>;

export type TypographyToken = keyof typeof typography;
