/**
 * @format
 */

// Must be the first import in the entire app — any other order causes intermittent gesture
// failures on Android that are very hard to diagnose later (doc 19 §3).
import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';

import App from './src/app/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
