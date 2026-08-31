/**
 * `react-native-svg-transformer` turns an imported .svg into a React component at bundle time.
 * TypeScript needs to be told that, or every asset import is an error.
 */
declare module '*.svg' {
  import type React from 'react';

  import type { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  export default content;
}
