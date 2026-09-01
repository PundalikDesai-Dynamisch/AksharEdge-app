import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { Screen, Icon } from '@components';
import { typography, spacing, colors, IconName } from '@theme';
import type { WizardScreenProps } from '@/navigation/types';

export function AssessmentPlaceholderScreen({ navigation }: WizardScreenProps<'AssessmentPlaceholder'>): React.JSX.Element {
  return (
    <Screen>
      <View style={styles.container}>
        <Icon name={IconName.info} size={48} color="primary" />
        <Text style={styles.title}>Assessment Placeholder</Text>
        <Text style={styles.subtitle}>This screen will be built in Phase 4.</Text>
        <Text style={styles.link} onPress={() => navigation.getParent()?.navigate('ParentHome')}>
          Return to Parent Home
        </Text>
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
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  link: {
    ...typography.button,
    color: colors.primaryDeep,
    marginTop: spacing.xl,
    padding: spacing.md,
  },
});
