/**
 * Security-rules tests run against the Firebase emulators in plain Node, so they need a config
 * of their own:
 *
 * - `testEnvironment: 'node'` — there is no React Native, no JSDOM and no component tree here.
 * - a standalone Babel transform — the root babel.config.js is built for Metro
 *   (@react-native/babel-preset plus the worklets plugin) and has no business transforming a
 *   Node test.
 * - `yarn test` excludes these files (see jest.config.js `testPathIgnorePatterns`), because a
 *   unit-test run must not require a running emulator.
 *
 * Run them with:
 *   yarn test:rules:emulate      (boots the emulators, then runs this config)
 *   yarn test:rules              (this config alone — needs emulators already running)
 *
 * `test:rules:emulate` prepends a JDK 21 to PATH because two requirements collide on this repo:
 * firebase-tools 15 refuses to start an emulator on anything below Java 21, while the Android
 * build is on JDK 17 — so the global JAVA_HOME cannot simply be moved. The lookup is scoped to
 * that one command, and falls through harmlessly on a machine without
 * /usr/libexec/java_home (Linux CI), where firebase-tools reports the version problem itself.
 */
module.exports = {
  displayName: 'rules',
  testEnvironment: 'node',
  rootDir: __dirname,
  testMatch: ['<rootDir>/*.rules.test.ts'],
  transform: {
    '^.+\\.ts$': [
      'babel-jest',
      {
        babelrc: false,
        configFile: false,
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
        ],
      },
    ],
  },
  // The emulator's first rules deploy plus a cold Firestore start comfortably exceeds Jest's
  // 5s default.
  testTimeout: 30000,
};
