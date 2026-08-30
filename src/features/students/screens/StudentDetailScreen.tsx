import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Screen } from '@components';
import { spacing, typography } from '@theme';

import type { AppScreenProps } from '@/navigation/types';

/** Stub — doc 07 §9 implements this fully in Phase 3 (upload list in Phase 5). */
export default function StudentDetailScreen({
  route,
  navigation,
}: AppScreenProps<'StudentDetail'>): React.JSX.Element {
  const { studentId } = route.params;

  const handleAddMaterial = useCallback(() => {
    navigation.navigate('UploadOptions', { studentId });
  }, [navigation, studentId]);

  const handleEdit = useCallback(() => {
    navigation.navigate('AddEditStudent', { studentId });
  }, [navigation, studentId]);

  return (
    <Screen>
      <View style={styles.body}>
        <Text style={styles.route}>StudentDetail</Text>
        <Text style={styles.detail}>studentId: {studentId}</Text>
      </View>

      <View style={styles.actions}>
        <Button label="Edit student" onPress={handleEdit} variant="secondary" />
        <Button label="+ Add Material" onPress={handleAddMaterial} />
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
  actions: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
});
