import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@components';
import { typography } from '@theme';

/** Stub — doc 07 §14 implements this fully in Phase 7. */
export default function ProfileScreen(): React.JSX.Element {
  return (
    <Screen>
      <View style={styles.body}>
        <Text style={styles.route}>Profile</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  route: {
    ...typography.title,
  },
});
