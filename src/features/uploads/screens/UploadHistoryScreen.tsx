import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@components';
import { spacing, typography } from '@theme';

/** Stub — doc 07 §12 implements this fully in Phase 5. */
export default function UploadHistoryScreen(): React.JSX.Element {
  return (
    <Screen edges={{ top: false }}>
      <View style={styles.body}>
        <Text style={styles.route}>HistoryTab</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  route: {
    ...typography.title,
  },
});
