/**
 * design.md §5: rounded rectangles at 16–24, cards at ~20, buttons pill or strongly rounded.
 * No sharp corners unless a native control requires them.
 */
export const radii = { sm: 12, md: 16, lg: 20, xl: 24, pill: 999 } as const;

export type RadiusToken = keyof typeof radii;
