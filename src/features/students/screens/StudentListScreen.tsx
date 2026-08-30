import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Button, Screen } from '@components';
import { PHASE0_FIXTURE_STUDENT_ID } from '@/constants/fixtures';
import { spacing, typography } from '@theme';

/** Stub — doc 07 §7 implements this fully in Phase 3. */
export default function StudentListScreen(): React.JSX.Element {
  // No generic needed: the ReactNavigation.RootParamList augmentation types this (doc 06 §11).
  const navigation = useNavigation();

  const handleAddStudent = useCallback(() => {
    navigation.navigate('AddEditStudent', {});
  }, [navigation]);

  const handleOpenDetail = useCallback(() => {
    navigation.navigate('StudentDetail', { studentId: PHASE0_FIXTURE_STUDENT_ID });
  }, [navigation]);

  return (
    <Screen scroll edges={{ top: false }}>
      <View style={styles.body}>
        <Text style={styles.route}>StudentsTab</Text>
      </View>

      <View style={styles.actions}>
        <Button label="Add Student" onPress={handleAddStudent} />
        <Button label="Open Student Detail" onPress={handleOpenDetail} variant="secondary" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  route: {
    ...typography.title,
  },
  actions: {
    gap: spacing.md,
  },
});
