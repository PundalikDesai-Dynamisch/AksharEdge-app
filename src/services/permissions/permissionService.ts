/**
 * Phase 3, Branch 21: Normalised permission service.
 *
 * The single place that talks to `react-native-permissions`. Every screen and hook reads
 * `PermissionStatus` from `src/types/models.ts` — never the library's own enum. That union
 * was designed in Phase 1 (see the doc comment at models.ts:44-57) and this service is the
 * adapter that satisfies it.
 */
import { Platform } from 'react-native';

import {
  check,
  request,
  openSettings as rnOpenSettings,
  PERMISSIONS,
} from 'react-native-permissions';

import type { Permission } from 'react-native-permissions';
import type { PermissionStatus } from '@/types/models';

import { mapLibraryResult } from './mapResult';

// Re-export so consumers can import from a single place.
export { mapLibraryResult } from './mapResult';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type PermissionKind = 'location' | 'camera';

// ---------------------------------------------------------------------------
// Platform → native permission key mapping
// ---------------------------------------------------------------------------

function nativeKey(kind: PermissionKind): Permission {
  if (kind === 'camera') {
    return Platform.OS === 'ios'
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;
  }

  // Location: "when in use" on iOS; fine on Android (coarse is also declared in the manifest
  // so Android 12+ shows the precise/approximate chooser, but the request targets fine).
  return Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const permissionService = {
  /**
   * Check the current OS status without prompting. Safe to call repeatedly.
   */
  async check(kind: PermissionKind): Promise<PermissionStatus> {
    const result = await check(nativeKey(kind));
    return mapLibraryResult(result);
  },

  /**
   * Trigger the OS permission dialog. On iOS, a second call after denial is a silent no-op
   * (the OS does not re-prompt) — the result will be `blocked`. On Android, a second denial
   * produces `blocked` (the "Don't ask again" checkbox is auto-ticked).
   */
  async request(kind: PermissionKind): Promise<PermissionStatus> {
    const result = await request(nativeKey(kind));
    return mapLibraryResult(result);
  },

  /**
   * Open the device Settings page for this app so the user can toggle a blocked permission.
   */
  async openSettings(): Promise<void> {
    await rnOpenSettings();
  },
};
