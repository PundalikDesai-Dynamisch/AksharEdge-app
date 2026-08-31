/**
 * Reanimated 4 runs for real under Jest thanks to `react-native-worklets/jest/resolver.js`
 * (see jest.config.js), so there is no library mock here — the animated components mount and the
 * tree is the real one.
 *
 * `Confetti` is deliberately written to make that honest: particle count, positions and colours
 * are computed in plain deterministic JS, and only the transform lives inside `useAnimatedStyle`.
 * A test can therefore assert structure without asserting motion.
 */
