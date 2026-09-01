/**
 * Phase 3, Branch 21: React hook that wraps `permissionService` with automatic re-checking.
 *
 * Returns `{ status, request, openSettings }` and re-checks on:
 *   1. Mount — initial `check()`
 *   2. `AppState` → `'active'` — user returning from device Settings
 *   3. Screen focus (`useFocusEffect`) — user can reach Settings and come back without the
 *      app ever backgrounding on some devices
 *
 * Both triggers are needed:
 *   - `AppState` alone misses the in-app-Settings case on iOS
 *   - `useFocusEffect` alone misses the case where the app was backgrounded on the gate screen
 *
 * A guard (`isCheckingRef`) prevents a double re-check from firing two requests.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import type { PermissionStatus } from '@/types/models';

import type { PermissionKind } from './permissionService';

import { permissionService } from './permissionService';

interface UsePermissionReturn {
  /** The current OS permission status. Starts as `'denied'` until the first check resolves. */
  status: PermissionStatus;
  /** Trigger the OS permission dialog. Sets status to `'requesting'` while the dialog is up. */
  request: () => Promise<void>;
  /** Open the device Settings page for this app. */
  openSettings: () => Promise<void>;
  /** True while checking the permission status (e.g. on mount). */
  isLoading: boolean;
  /** True if a request has been made during this session. */
  hasRequested: boolean;
}

export function usePermission(kind: PermissionKind): UsePermissionReturn {
  const [status, setStatus] = useState<PermissionStatus>('denied');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasRequested, setHasRequested] = useState<boolean>(false);

  // Guard against overlapping re-checks (AppState + focus can fire close together).
  const isCheckingRef = useRef(false);

  const recheck = useCallback(async (): Promise<void> => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
    setIsLoading(true);

    try {
      const result = await permissionService.check(kind);
      setStatus(result);
    } finally {
      isCheckingRef.current = false;
      setIsLoading(false);
    }
  }, [kind]);

  // 1. Mount — initial check
  useEffect(() => {
    recheck();
  }, [recheck]);

  // 2. AppState → 'active' — user returning from device Settings
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: string) => {
      if (nextState === 'active') {
        recheck();
      }
    });

    return () => subscription.remove();
  }, [recheck]);

  // 3. Screen focus — user navigated away and back (covers the in-app-Settings case on iOS
  //    where AppState never transitions)
  useFocusEffect(
    useCallback(() => {
      recheck();
    }, [recheck]),
  );

  const handleRequest = useCallback(async (): Promise<void> => {
    setHasRequested(true);
    setStatus('requesting');
    const result = await permissionService.request(kind);
    setStatus(result);
  }, [kind]);

  const handleOpenSettings = useCallback(async (): Promise<void> => {
    await permissionService.openSettings();
  }, []);

  return {
    status,
    request: handleRequest,
    openSettings: handleOpenSettings,
    isLoading,
    hasRequested,
  };
}
