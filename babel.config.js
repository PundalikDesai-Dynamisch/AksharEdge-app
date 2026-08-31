/**
 * Path aliases must mirror tsconfig.json's `paths` exactly (doc 03 §2) — Metro resolves
 * through this file, tsc resolves through tsconfig, and a drift between the two produces
 * code that type-checks but fails to bundle.
 */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@': './src',
          '@features': './src/features',
          '@components': './src/components',
          '@services': './src/services',
          '@data': './src/data',
          '@assets': './src/assets',
          '@db': './src/database',
          '@store': './src/store',
          '@theme': './src/theme',
          '@utils': './src/utils',
          '@types': './src/types',
        },
      },
    ],
    // Reanimated 4 ships its Babel transform in react-native-worklets. Must stay last
    // (doc 19 §3 — the rule is "the reanimated worklet plugin is last", not the package name).
    'react-native-worklets/plugin',
  ],
};
