/**
 * The React Native preset gets most of the way, but two of its defaults are wrong for this app:
 *
 * 1. `transformIgnorePatterns` skips everything in node_modules except React Native itself.
 *    Reanimated 4 and react-native-worklets ship untranspiled ESM, so importing them in a test
 *    throws "Cannot use import statement outside a module" until they are allow-listed.
 * 2. `.svg` resolves through the preset's asset transformer rather than through
 *    react-native-svg-transformer, which makes every mascot, avatar and badge render as `null` —
 *    silently. See jest/svgMock.js.
 *
 * It also has to exclude the security-rules suites, which are not React Native tests at all.
 */
const TRANSPILED_PACKAGES = [
  '(jest-)?react-native',
  '@react-native(-community)?',
  '@react-native-vector-icons',
  'react-native-reanimated',
  'react-native-worklets',
  'react-native-safe-area-context',
  'react-native-gesture-handler',
  'react-native-screens',
  'immer',
  '@react-native-firebase',
  'firebase',
  '@firebase',
].join('|');

module.exports = {
  preset: '@react-native/jest-preset',
  // Shipped by react-native-worklets for exactly this: it strips the `.native` extension when
  // resolving inside the worklets package, which otherwise drags the real native module into a
  // test run and throws from NativeWorklets. It delegates to Jest's default resolver for
  // everything else.
  resolver: require.resolve('react-native-worklets/jest/resolver.js'),
  setupFiles: ['<rootDir>/jest/setup.js'],
  // The *.rules.test.ts suites need a running Firebase emulator and a Node environment, so they
  // live in jest.rules.config.js. Without this, `yarn test` picks them up and every run fails
  // with "Unable to find the Firestore emulator".
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '\\.rules\\.test\\.ts$'],
  transformIgnorePatterns: [`node_modules/(?!(?:${TRANSPILED_PACKAGES})/)`],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/jest/svgMock.js',
  },
};
