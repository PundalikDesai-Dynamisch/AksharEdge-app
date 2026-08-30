import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@components';
import { spacing, typography } from '@theme';

import type { AppScreenProps } from '@/navigation/types';

/** Stub — doc 07 §8 implements this fully in Phase 3. */
export default function AddEditStudentScreen({
  route,
}: AppScreenProps<'AddEditStudent'>): React.JSX.Element {
  const mode = route.params.studentId === undefined ? 'create' : 'edit';

  return (
    <Screen>
      <View style={styles.body}>
        <Text style={styles.route}>AddEditStudent</Text>
        <Text style={styles.detail}>mode: {mode}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  route: {
    ...typography.title,
  },
  detail: {
    ...typography.bodyMuted,
  },
});
