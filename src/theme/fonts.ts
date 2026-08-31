/**
 * Fonts are addressed by PostScript name, not by family + `fontWeight`.
 *
 * These families ship one file per weight with distinct family names ("Baloo 2 SemiBold" is its
 * own family, not a weight of "Baloo 2"), so `fontWeight` cannot select between them reliably —
 * Android resolves the asset filename while iOS resolves the PostScript name. Every file here is
 * named so filename == PostScript name, which makes one string work on both platforms.
 *
 * Do not pair these with `fontWeight`: doing so invites synthetic bolding on top of an already
 * bold face.
 */
export const fonts = {
  /** Baloo 2 — headings, mission names, celebration copy. design.md §6. */
  headingRegular: 'Baloo2-Regular',
  headingSemiBold: 'Baloo2-SemiBold',
  headingBold: 'Baloo2-Bold',
  headingExtraBold: 'Baloo2-ExtraBold',

  /** Nunito — body and UI. */
  bodyRegular: 'Nunito-Regular',
  bodySemiBold: 'Nunito-SemiBold',
  bodyBold: 'Nunito-Bold',
} as const;

export type FontToken = keyof typeof fonts;
