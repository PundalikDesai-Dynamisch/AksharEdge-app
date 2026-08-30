import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, ConfirmDialog, Screen } from '@components';
import { spacing, typography } from '@theme';

import type { AppScreenProps } from '@/navigation/types';

/** Stub — doc 07 §11 implements this fully in Phase 4. */
export default function CapturePreviewScreen({
  route,
  navigation,
}: AppScreenProps<'CapturePreview'>): React.JSX.Element {
  const { files, source, studentId } = route.params;
  const [isConfirmingDiscard, setIsConfirmingDiscard] = useState(false);

  const handleAskDiscard = useCallback(() => {
    setIsConfirmingDiscard(true);
  }, []);

  const handleCancelDiscard = useCallback(() => {
    setIsConfirmingDiscard(false);
  }, []);

  const handleConfirmDiscard = useCallback(() => {
    // TODO(phase-4): delete every already-copied temp file before leaving (doc 07 §11, doc 14 §9).
    setIsConfirmingDiscard(false);
    navigation.goBack();
  }, [navigation]);

  return (
    <Screen>
      <View style={styles.body}>
        <Text style={styles.route}>CapturePreview</Text>
        <Text style={styles.detail}>
          studentId: {studentId} · source: {source} · files: {files.length}
        </Text>
      </View>

      <View style={styles.actions}>
        <Button label="Discard" onPress={handleAskDiscard} variant="ghost" />
      </View>

      <ConfirmDialog
        visible={isConfirmingDiscard}
        title="Discard these files?"
        message="The captured pages will be deleted and not uploaded."
        confirmLabel="Discard"
        destructive
        onConfirm={handleConfirmDiscard}
        onCancel={handleCancelDiscard}
      />
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
    textAlign: 'center',
  },
  actions: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
});
