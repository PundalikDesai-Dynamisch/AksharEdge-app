import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Card } from '@components';
import { colors, radii, spacing, typography } from '@theme';

import type { CapturedFileDraft } from '@/domain/entities/CapturedFileDraft';
import type { AppScreenProps } from '@/navigation/types';

/**
 * Stub — doc 07 §10 implements this fully in Phase 4.
 *
 * Presented as a transparent modal, so it draws its own backdrop and sheet rather than using
 * `Screen` (which owns a full-bleed background).
 */
export default function UploadOptionsScreen({
  route,
  navigation,
}: AppScreenProps<'UploadOptions'>): React.JSX.Element {
  const { studentId } = route.params;

  const handleDismiss = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleScan = useCallback(() => {
    // TODO(phase-4): captureService.scanDocument() produces these drafts for real (doc 14 §4).
    const files: CapturedFileDraft[] = [
      {
        tempUri: 'file:///phase0/stub-page-1.jpg',
        suggestedFileName: 'stub-page-1.jpg',
        fileType: 'image',
        mimeType: 'image/jpeg',
        sizeBytes: 0,
      },
    ];
    // `replace`, so back does not return to a dead option sheet (doc 06 §4.4).
    navigation.replace('CapturePreview', { studentId, files, source: 'scan' });
  }, [navigation, studentId]);

  return (
    <Pressable style={styles.backdrop} onPress={handleDismiss} accessibilityRole="button">
      <Pressable style={styles.sheetWrap} onPress={undefined}>
        <Card style={styles.sheet}>
          <View style={styles.grabber} />
          <Text style={styles.title}>UploadOptions</Text>
          <Text style={styles.detail}>studentId: {studentId}</Text>

          <View style={styles.actions}>
            <Button label="Scan Document" onPress={handleScan} />
            <Button label="Cancel" onPress={handleDismiss} variant="ghost" />
          </View>
        </Card>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  sheetWrap: {
    padding: spacing.md,
  },
  sheet: {
    gap: spacing.sm,
  },
  grabber: {
    alignSelf: 'center',
    width: spacing.xxl,
    height: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  detail: {
    ...typography.bodyMuted,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
