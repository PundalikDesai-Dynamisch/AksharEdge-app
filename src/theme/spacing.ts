/** 4px base unit, used exclusively — no ad hoc pixel numbers anywhere else (doc 18 §1). */
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

export type SpacingToken = keyof typeof spacing;
