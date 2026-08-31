/**
 * Cross-cutting string unions. String literals rather than enums so the same values move
 * unchanged between Firestore fields and TypeScript.
 *
 * The upload/queue/sync unions belonged to the teacher-era offline-upload product and were
 * removed with it.
 */

/**
 * The illustrated avatar set.
 *
 * A closed union rather than `string`, because design.md §7 forbids photographic child imagery
 * outright — a bare string would happily accept a photo URL, which is precisely what that rule
 * exists to prevent. Declared here rather than derived from the asset registry so the domain and
 * data layers can name an avatar without importing artwork; `src/assets/registry.ts` proves the
 * map exhaustive against this union with `satisfies`.
 *
 * The runtime tuple and its guard live beside the type deliberately: Firestore is untyped at the
 * wire, so the mapper needs a value to check against, and a second copy of this list somewhere
 * else is a list that drifts.
 */
export const AVATAR_IDS = [
  'avatar-01',
  'avatar-02',
  'avatar-03',
  'avatar-04',
  'avatar-05',
  'avatar-06',
  'avatar-07',
  'avatar-08',
  'avatar-09',
  'avatar-10',
  'avatar-11',
  'avatar-12',
] as const;

export type AvatarId = (typeof AVATAR_IDS)[number];

export const DEFAULT_AVATAR_ID: AvatarId = 'avatar-01';

export function isAvatarId(value: unknown): value is AvatarId {
  return typeof value === 'string' && (AVATAR_IDS as readonly string[]).includes(value);
}

export type AuthStatus = 'unknown' | 'signedOut' | 'signedIn';

export type AuthProvider = 'password' | 'google';

export type Gender = 'male' | 'female' | 'other' | 'unspecified';

export type ToastKind = 'success' | 'info' | 'warning' | 'error';

export type ContactMethod = 'email' | 'phone';

export type SchoolingLevel = 'preK' | 'primary' | 'middle';

/** Drives the status pill on Parent Home and the Play/Report tab gating. */
export type ChildStatus = 'not_started' | 'in_progress' | 'report_ready';

/** Which mission plan a child receives. Derived, never stored on the child. */
export type AgeBand = 'early' | 'middle' | 'upper';

export type AssessmentStatus = 'in_progress' | 'submitted' | 'scored' | 'failed';

export type WritingStatus = 'pending' | 'uploaded' | 'failed';

export type MetricUnit = 'ms' | 'count' | 'ratio';

/** Deliberately not a raw score — design.md §17 forbids a scary number. */
export type ReportStatus = 'on_track' | 'monitor' | 'recommend_followup';

export type MetricBand = 'strong' | 'expected' | 'watch';
