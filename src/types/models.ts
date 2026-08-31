/**
 * Cross-cutting string unions. String literals rather than enums so the same values move
 * unchanged between Firestore fields and TypeScript.
 *
 * The upload/queue/sync unions belonged to the teacher-era offline-upload product and were
 * removed with it. Phase 3 adds `SchoolingLevel`, Phase 4 the assessment unions.
 */

export type AuthStatus = 'unknown' | 'signedOut' | 'signedIn';

export type AuthProvider = 'password' | 'google';

export type Gender = 'male' | 'female' | 'other' | 'unspecified';

export type ToastKind = 'success' | 'info' | 'warning' | 'error';
