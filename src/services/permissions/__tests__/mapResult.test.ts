/**
 * Phase 3, Branch 21: Unit tests for the permission status mapping function.
 *
 * `mapLibraryResult` is the single most defect-prone function in the permission phase. It is
 * pure — no mocks, no platform, no async — so it gets a real test for every possible input.
 *
 * Imports from `mapResult.ts` directly (not `permissionService.ts`) so these tests never
 * touch a native module and can run in plain Jest.
 */
import { mapLibraryResult } from '../mapResult';

// The RESULTS constants from react-native-permissions as literal strings, so these tests
// do not depend on the library being importable in a Node/Jest environment.
const LIBRARY_RESULTS = {
  UNAVAILABLE: 'unavailable',
  DENIED: 'denied',
  LIMITED: 'limited',
  GRANTED: 'granted',
  BLOCKED: 'blocked',
} as const;

describe('mapLibraryResult', () => {
  const cases: [string, string][] = [
    [LIBRARY_RESULTS.UNAVAILABLE, 'unavailable'],
    [LIBRARY_RESULTS.DENIED, 'denied'],
    [LIBRARY_RESULTS.GRANTED, 'granted'],
    [LIBRARY_RESULTS.LIMITED, 'granted'], // iOS 14 limited access is functionally usable
    [LIBRARY_RESULTS.BLOCKED, 'blocked'],
  ];

  it.each(cases)(
    'maps library result "%s" → PermissionStatus "%s"',
    (libraryResult, expected) => {
      expect(mapLibraryResult(libraryResult)).toBe(expected);
    },
  );

  it('maps an unknown future library value to "denied" as a safe default', () => {
    expect(mapLibraryResult('some_future_value')).toBe('denied');
  });

  it('never returns "requesting" — that is a transient UI-only state', () => {
    for (const result of Object.values(LIBRARY_RESULTS)) {
      expect(mapLibraryResult(result)).not.toBe('requesting');
    }
  });
});
