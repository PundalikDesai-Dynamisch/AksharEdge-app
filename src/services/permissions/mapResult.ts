/**
 * Phase 3, Branch 21: The pure mapping from react-native-permissions result strings to our
 * own PermissionStatus union.
 *
 * Deliberately in its own file so it can be imported and unit-tested without pulling in any
 * native module. The permissionService imports this; tests import this directly.
 */
import type { PermissionStatus } from '@/types/models';

/**
 * The five possible result strings from react-native-permissions.
 * Declared as plain strings so this module has zero native imports.
 */
const UNAVAILABLE = 'unavailable';
const DENIED = 'denied';
const GRANTED = 'granted';
const LIMITED = 'limited';
const BLOCKED = 'blocked';

/**
 * Maps the library's result string to our own `PermissionStatus` union.
 *
 * The library returns one of five values:
 *   unavailable | denied | limited | granted | blocked
 *
 * Our union is:
 *   unavailable | denied | granted | blocked | requesting
 *
 * `requesting` is never returned by the OS — it is a transient UI state the hook sets while
 * the dialog is up. `limited` (iOS 14 photo library) maps to `granted` because for Camera
 * and Location it means "usable with restrictions", which is good enough.
 */
export function mapLibraryResult(result: string): PermissionStatus {
  switch (result) {
    case UNAVAILABLE:
      return 'unavailable';
    case DENIED:
      return 'denied';
    case GRANTED:
      return 'granted';
    case LIMITED:
      // iOS 14+ "limited" access — functionally usable for our purposes.
      return 'granted';
    case BLOCKED:
      return 'blocked';
    default:
      // Defensive: an unknown result from a future library version should not crash.
      return 'denied';
  }
}
