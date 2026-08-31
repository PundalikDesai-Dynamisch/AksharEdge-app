import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors, radii, shadows, spacing, typography } from '@theme';

import { Button } from './Button';

export interface DialogAction {
  readonly label: string;
  readonly onPress: () => void;
  readonly loading?: boolean;
}

interface DialogProps {
  visible: boolean;
  title: string;
  message: string;
  /** The affirmative action. Always present — a dialog with no action is a dead end. */
  primary: DialogAction;
  /** Omitted for a single-action acknowledgement. */
  secondary?: DialogAction;
  /** Colours the primary action for an irreversible action, e.g. deleting a child profile. */
  destructive?: boolean;
  /** Mascot/illustration slot, design.md §8.6. */
  illustration?: React.ReactNode;
  /**
   * Backdrop tap and Android hardware back. Omit to make the dialog non-dismissible — the caller
   * then has to choose an action, which is what a genuinely blocking decision needs.
   */
  onDismiss?: () => void;
}

/**
 * The app's one modal surface (design.md §8.6): rounded, mobile-native, with a mascot slot and
 * clear primary/secondary actions.
 *
 * `ConfirmDialog` is a thin wrapper over this rather than a second implementation, so there is
 * exactly one place that owns the Modal mechanics, the scrim, and the dismiss semantics.
 */
export function Dialog({
  visible,
  title,
  message,
  primary,
  secondary,
  destructive = false,
  illustration,
  onDismiss,
}: DialogProps): React.JSX.Element {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <Pressable
        style={styles.backdrop}
        onPress={onDismiss}
        // A non-dismissible dialog's backdrop is not a control, so it must not claim to be one.
        accessibilityRole={onDismiss === undefined ? undefined : 'button'}
        accessibilityLabel={
          onDismiss === undefined ? undefined : strings.accessibility.closeDialog
        }
        disabled={onDismiss === undefined}
      >
        {/* Swallows presses inside the sheet so tapping the dialog body does not dismiss it. */}
        <Pressable style={styles.sheet} onPress={undefined} accessibilityViewIsModal>
          {illustration !== undefined && (
            <View style={styles.illustration}>{illustration}</View>
          )}

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            {secondary !== undefined && (
              <Button
                label={secondary.label}
                onPress={secondary.onPress}
                loading={secondary.loading ?? false}
                variant="ghost"
                fullWidth={false}
                style={styles.action}
              />
            )}
            <Button
              label={primary.label}
              onPress={primary.onPress}
              loading={primary.loading ?? false}
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
    ...shadows.lg,
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
  },
  illustration: {
    alignItems: 'center',
    marginBottom: spacing.lg,
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
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  action: {
    minWidth: spacing.xxxl * 2,
  },
});
