import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';

import { RootNavigator } from '@/navigation/RootNavigator';
import { store } from '@store/index';
import { colors } from '@theme';

import { bootstrap } from './bootstrap';

/**
 * Provider order is fixed by doc 04 §10 step 2:
 * SafeAreaProvider → ReduxProvider → GestureHandlerRootView → RootNavigator.
 *
 * The bootstrap sequence (DB open, migrations, auth listener, monitors, sync engine) mounts
 * here from Phase 1 on; Phase 0 has nothing to boot.
 */
export default function App(): React.JSX.Element {
  React.useEffect(() => {
    bootstrap();
  }, []);

  return (
    <SafeAreaProvider>
      <ReduxProvider store={store}>
        <GestureHandlerRootView style={styles.root}>
          <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
          <RootNavigator />
        </GestureHandlerRootView>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
