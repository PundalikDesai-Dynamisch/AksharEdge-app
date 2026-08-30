import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors, radii, spacing, typography } from '@theme';

import { Button } from './Button';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

/** Used for every destructive action in doc 07 — delete student, sign out, discard capture. */
export function ConfirmDialog({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = strings.common.confirm,
  cancelLabel = strings.common.cancel,
  destructive = false,
}: ConfirmDialogProps): React.JSX.Element {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <Pressable
        style={styles.backdrop}
        onPress={onCancel}
        accessibilityRole="button"
        accessibilityLabel={strings.accessibility.closeDialog}
      >
        {/* Swallows presses inside the sheet so tapping the dialog body does not dismiss it. */}
        <Pressable style={styles.sheet} onPress={undefined} accessibilityViewIsModal>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Button
              label={cancelLabel}
              onPress={onCancel}
              variant="ghost"
              fullWidth={false}
              style={styles.action}
            />
            <Button
              label={confirmLabel}
              onPress={onConfirm}
              variant={destructive ? 'destructive' : 'primary'}
              fullWidth={false}
              style={styles.action}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  sheet: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  action: {
    minWidth: spacing.xxxl * 2,
  },
});
