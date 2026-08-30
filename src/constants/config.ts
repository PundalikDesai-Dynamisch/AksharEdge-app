import { IconName } from '@theme';

import type { ColorToken, IconGlyph } from '@theme';
import type { ToastKind, UploadStatus } from '@/types/models';

interface StatusColors {
  readonly fg: ColorToken;
  readonly bg: ColorToken;
}

/**
 * Declared once here and consumed by every status surface (UploadStatusPill, SyncStatusBanner),
 * so a status can never be shown in two different colours in two places (doc 18 §2).
 */
export const STATUS_COLOR_MAP: Readonly<Record<UploadStatus, StatusColors>> = {
  pending: { fg: 'warning', bg: 'warningMuted' },
  uploading: { fg: 'info', bg: 'infoMuted' },
  uploaded: { fg: 'success', bg: 'successMuted' },
  failed: { fg: 'danger', bg: 'dangerMuted' },
};

export const STATUS_ICON_MAP: Readonly<Record<UploadStatus, IconGlyph>> = {
  pending: IconName.clock,
  uploading: IconName.uploadCloud,
  uploaded: IconName.checkCircle,
  failed: IconName.alertCircle,
};

/** Offline is not an upload status, but it shares the pill/banner presentation (doc 18 §2). */
export const OFFLINE_INDICATOR: { fg: ColorToken; bg: ColorToken; icon: IconGlyph } = {
  fg: 'textMuted',
  bg: 'border',
  icon: IconName.wifiOff,
};

/** doc 07 §16.3 — an error stays long enough to read and act on; a success does not. */
export const TOAST_DURATION_MS: Readonly<Record<ToastKind, number>> = {
  success: 2000,
  info: 3000,
  warning: 4000,
  error: 5000,
};

/** NFR-9: every interactive element is at least 44×44 pt. */
export const MIN_TOUCH_TARGET = 44;

export const APP_SCHEME = 'aksharedge://';
