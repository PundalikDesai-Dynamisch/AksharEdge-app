/**
 * Layer boundaries are enforced here rather than left as convention,
 * because an import that crosses a layer still "works" at runtime — only lint catches it.
 */

const FIREBASE_MESSAGE = 'Firebase may only be imported inside src/data/firebase/ or src/services/firebase/.';
const PRESENTATION_MESSAGE =
  'Presentation may not reach the data layer directly. Go through a slice/thunk — repositories\n   are injected as the RTK `extra` argument.';
const DOMAIN_MESSAGE =
  'Domain must stay pure — no React, Redux, Firebase, data layer, or I/O. It must be unit-testable with zero mocks.';

module.exports = {
  root: true,
  extends: ['@react-native'],
  plugins: ['import'],
  rules: {
    // doc 23 §8 writes this as `['error', { allow: [] }]`, which ESLint's schema rejects
    // (`allow` requires ≥1 entry). Bare 'error' is the same thing: nothing is allowed.
    'no-console': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react-redux',
            importNames: ['useDispatch', 'useSelector'],
            message: 'Use useAppDispatch/useAppSelector from @store/hooks instead.',
          },
        ],
        patterns: [{ group: ['@react-native-firebase/*'], message: FIREBASE_MESSAGE }],
      },
    ],
    // Enforces doc 05 §5's five import groups. Type imports are ordered with their path group,
    // not segregated into a block of their own — that is what doc 05 §5's example shows.
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          // One entry, not two, so `react` and `react-native` share a rank and need no blank
          // line between them (doc 05 §5 group 1).
          { pattern: '{react,react-native}', group: 'external', position: 'before' },
          { pattern: '@/**', group: 'internal' },
          { pattern: '@features/**', group: 'internal' },
          { pattern: '@components', group: 'internal' },
          { pattern: '@components/**', group: 'internal' },
          { pattern: '@services/**', group: 'internal' },
          { pattern: '@data/**', group: 'internal' },
          { pattern: '@assets/**', group: 'internal' },
          { pattern: '@db/**', group: 'internal' },
          { pattern: '@store/**', group: 'internal' },
          { pattern: '@theme', group: 'internal' },
          { pattern: '@theme/**', group: 'internal' },
          { pattern: '@utils/**', group: 'internal' },
          { pattern: '@types/**', group: 'internal' },
          { pattern: '**/*.styles', group: 'index', position: 'after' },
        ],
        pathGroupsExcludedImportTypes: ['react', 'react-native'],
        'newlines-between': 'always-and-inside-groups',
      },
    ],
  },
  overrides: [
    {
      // These ARE the Firebase boundary. `src/data/firebase/` holds the repositories;
      // `src/services/firebase/` holds authService, which is a service rather than a
      // repository and stays where it is.
      files: ['src/data/firebase/**/*.ts', 'src/services/firebase/**/*.ts'],
      rules: { 'no-restricted-imports': 'off' },
    },
    {
      // Presentation: screens and components may not touch the data layer (doc 04 §3).
      files: [
        'src/features/**/screens/**/*.tsx',
        'src/features/**/screens/**/*.ts',
        'src/features/**/components/**/*.tsx',
        'src/components/**/*.tsx',
        'src/navigation/**/*.tsx',
      ],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'react-redux',
                importNames: ['useDispatch', 'useSelector'],
                message: 'Use useAppDispatch/useAppSelector from @store/hooks instead.',
              },
              { name: 'react-native-fs', message: PRESENTATION_MESSAGE },
              { name: '@op-engineering/op-sqlite', message: PRESENTATION_MESSAGE },
            ],
            patterns: [
              { group: ['@react-native-firebase/*'], message: FIREBASE_MESSAGE },
              {
                group: ['@data/*', '@data/**', '@/data/*', '@/data/**'],
                message: PRESENTATION_MESSAGE,
              },
            ],
          },
        ],
      },
    },
    {
      // Domain must be pure (doc 04 §2–3).
      files: ['src/domain/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              { name: 'react', message: DOMAIN_MESSAGE },
              { name: 'react-native', message: DOMAIN_MESSAGE },
              { name: '@reduxjs/toolkit', message: DOMAIN_MESSAGE },
              { name: 'react-native-fs', message: DOMAIN_MESSAGE },
              { name: '@op-engineering/op-sqlite', message: DOMAIN_MESSAGE },
            ],
            patterns: [
              { group: ['@react-native-firebase/*'], message: DOMAIN_MESSAGE },
              { group: ['@data/*', '@data/**'], message: DOMAIN_MESSAGE },
            ],
          },
        ],
      },
    },
    {
      // Jest scaffolding is plain CommonJS with no TypeScript to annotate, so the return-type
      // rule has nothing useful to say about it.
      files: ['jest/**/*.js', 'jest.config.js'],
      rules: { '@typescript-eslint/explicit-function-return-type': 'off' },
    },
    {
      // The logger is the one sanctioned console call site (doc 23 §5).
      files: ['src/utils/logger.ts'],
      rules: { 'no-console': 'off' },
    },
    {
      // This IS where the typed hooks are defined (doc 16 §9).
      files: ['src/store/hooks.ts'],
      rules: { 'no-restricted-imports': 'off' },
    },
  ],
};
