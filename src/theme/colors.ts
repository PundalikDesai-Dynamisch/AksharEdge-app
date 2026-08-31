/**
 * The AksharEdge palette, per design.md §4.
 *
 * Coral carries important actions and encouragement, sky blue carries trust and supporting UI,
 * yellow is reserved for rewards and celebration, and green means completed. Backgrounds stay
 * light and warm. Every accent has a `*Muted` wash for use as a fill behind its own foreground —
 * Chip and Toast pair them dynamically, so both halves of every pair must exist.
 *
 * ✅ Contrast conflict resolved 2026-08-31, in phase-1/restyle-base-components. design.md §8.1
 * asks for a coral fill under a white label, but white on `primary` measures 2.82:1 — a fail
 * against WCAG AA and against the 3:1 large-text threshold. Carrying it to Phase 7 would have
 * meant restyling every button in the app twice, which is the exact cost Phase 1 exists to avoid,
 * so it was decided here: **filled actions use `primaryDeep`** (white label → 5.22:1), while
 * `primary` itself is untouched and still carries accents, active emphasis, and illustration.
 * The brand colour is intact; only the CTA fill moved. Every pairing in this file now passes AA.
 */
export const colors = {
  primary: '#FF6B4A', // coral — main CTA, active emphasis, encouragement
  primaryMuted: '#FFEDE7',
  // Coral at text weight. Passes AA on cream, on primaryMuted, and — since 2026-08-31 — as
  // the fill under a white label on every filled action. See the note above.
  primaryDeep: '#B54C35',

  secondary: '#4AC8FF', // sky — trust, calm actions, supporting UI
  secondaryMuted: '#E4F5FE',

  accent: '#FFD24A', // yellow — rewards and celebration ONLY, never routine UI
  accentMuted: '#FFF6DC',

  background: '#FFFBF5', // warm cream
  surface: '#FFFFFF',
  border: '#EDE0D1', // warm and soft — design.md §5 avoids harsh borders
  text: '#333333', // never pure black
  textMuted: '#6B6058',
  textInverse: '#FFFFFF',

  // Base colours are design.md's, for fills, icons and status dots. The `*Deep` pairs exist
  // because base-on-muted is illegible as text: success on successMuted measures 1.65:1 and
  // warning on warningMuted 2.13:1. Chip, Toast and Button take foregrounds from `*Deep`.
  success: '#5FD87A',
  successDeep: '#377D47',
  successMuted: '#E7F9ED',
  warning: '#E8952F',
  warningDeep: '#99621F',
  warningMuted: '#FDF0DF',
  danger: '#D34247',
  dangerDeep: '#C33D41',
  dangerMuted: '#FDECEC',
  info: '#0E86BC',
  infoDeep: '#0C76A5',
  infoMuted: '#E4F5FE',

  overlay: 'rgba(51, 41, 33, 0.45)', // warm-biased scrim, not neutral black
} as const;

export type ColorToken = keyof typeof colors;
