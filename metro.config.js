const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * SVG handling: `react-native-svg-transformer` compiles an imported .svg into a React component
 * at bundle time, which is what makes `src/assets/registry.ts` work. It needs .svg moved out of
 * `assetExts` and into `sourceExts` — leaving it in assetExts makes the import resolve to a URI
 * string instead, which fails silently at render.
 */
const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
