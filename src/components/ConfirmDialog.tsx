import React from 'react';

import { strings } from '@/constants/strings';

import { Dialog } from './Dialog';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  /** Mascot/illustration slot required by design.md §8.6 — see the note on EmptyState. */
  illustration?: React.ReactNode;
}

/**
 * The two-action confirmation used for every reversible-looking but consequential action —
 * spec §8's "Remove [Child]'s profile?", sign-out, discarding a capture.
 *
 * Kept as a named component over `Dialog` because the confirm/cancel pair is the overwhelmingly
 * common case and callers should not have to assemble it each time.
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = strings.common.confirm,
  cancelLabel = strings.common.cancel,
  destructive = false,
  illustration,
}: ConfirmDialogProps): React.JSX.Element {
  return (
    <Dialog
      visible={visible}
      title={title}
      message={message}
      illustration={illustration}
      destructive={destructive}
      onDismiss={onCancel}
      secondary={{ label: cancelLabel, onPress: onCancel }}
      primary={{ label: confirmLabel, onPress: onConfirm }}
    />
  );
}
