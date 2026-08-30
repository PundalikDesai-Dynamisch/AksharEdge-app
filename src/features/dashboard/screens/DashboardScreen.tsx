import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Button, Screen } from '@components';
import { spacing, typography } from '@theme';

/** Stub — doc 07 §6 implements this fully in Phase 2. */
export default function DashboardScreen(): React.JSX.Element {
  // No generic needed: the ReactNavigation.RootParamList augmentation types this (doc 06 §11).
  const navigation = useNavigation();

  const handleAddStudent = useCallback(() => {
    navigation.navigate('AddEditStudent', {});
  }, [navigation]);

  const handleOpenProfile = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);

  return (
    <Screen scroll edges={{ top: false }}>
      <View style={styles.body}>
        <Text style={styles.route}>DashboardTab</Text>
      </View>

      <View style={styles.actions}>
        <Button label="Add Student" onPress={handleAddStudent} />
        <Button label="Profile" onPress={handleOpenProfile} variant="secondary" />
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
