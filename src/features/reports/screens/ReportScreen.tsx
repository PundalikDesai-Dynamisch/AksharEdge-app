import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Screen } from '@components';
import { typography, spacing, colors } from '@theme';

export function ReportScreen(): React.JSX.Element {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Report Placeholder</Text>
        <Text style={styles.body}>This screen will be implemented in a future branch.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.title,
    color: colors.primaryDeep,
    marginBottom: spacing.md,
  },
  body: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
