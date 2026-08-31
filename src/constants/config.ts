import { IconName } from '@theme';

import type { ColorToken, IconGlyph } from '@theme';
import type { ToastKind } from '@/types/models';

/**
 * Offline is not an upload status, but it shares the pill/banner presentation.
 * Consumed by components/OfflineBanner.tsx.
 */
export const OFFLINE_INDICATOR: { fg: ColorToken; bg: ColorToken; icon: IconGlyph } = {
  fg: 'textMuted',
  bg: 'border',
  icon: IconName.wifiOff,
};

/** An error stays long enough to read and act on; a success does not. */
export const TOAST_DURATION_MS: Readonly<Record<ToastKind, number>> = {
  success: 2000,
  info: 3000,
  warning: 4000,
  error: 5000,
};

/** NFR-9: every interactive element is at least 44×44 pt. */
export const MIN_TOUCH_TARGET = 44;

export const APP_SCHEME = 'aksharedge://';
