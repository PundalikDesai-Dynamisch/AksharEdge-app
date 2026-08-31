/**
 * `react-native-svg-transformer` compiles an imported .svg into a React component at bundle time
 * (see metro.config.js). Jest does not run Metro, so it falls back to the React Native preset's
 * asset transformer and every .svg import becomes a plain asset stub.
 *
 * That fails SILENTLY: <Mascot />, <Avatar /> and <RewardBadge /> each render `null`, and a
 * snapshot test happily records the nothing they produced. This mock restores a real component so
 * the artwork shows up in the tree as a view with its props intact.
 */
const React = require('react');
const { View } = require('react-native');

/** @returns {React.ReactElement} */
function SvgMock(props) {
  return React.createElement(View, props);
}

module.exports = { __esModule: true, default: SvgMock, ...SvgMock };
