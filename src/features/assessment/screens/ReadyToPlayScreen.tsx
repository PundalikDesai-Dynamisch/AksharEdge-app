import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Screen } from '@components';
import { typography, spacing, colors } from '@theme';

export function ReadyToPlayScreen(): React.JSX.Element {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Ready To Play Placeholder</Text>
        <Text style={styles.body}>This screen will be implemented in Branch 28.</Text>
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
