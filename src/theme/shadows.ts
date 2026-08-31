import type { ViewStyle } from 'react-native';

/**
 * design.md §5 asks for soft drop shadows and light elevation. React Native does not share one
 * shadow model across platforms, so each token carries both the iOS properties and the Android
 * `elevation` that approximates it — using only one leaves the other platform flat.
 *
 * The shadow colour is warm rather than neutral black so it sits correctly on the cream ground.
 */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  /** Cards at rest, list rows. */
  sm: {
    shadowColor: '#402A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  /** Raised cards, the selected state of a pressable surface. */
  md: {
    shadowColor: '#402A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
  },
  /** Bottom sheets, dialogs, the reward overlay. */
  lg: {
    shadowColor: '#402A1A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 22,
    elevation: 8,
  },
} satisfies Record<string, ViewStyle>;

export type ShadowToken = keyof typeof shadows;
