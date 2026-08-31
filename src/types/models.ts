/**
 * Cross-cutting string unions. String literals rather than enums so the same values move
 * unchanged between Firestore fields and TypeScript.
 *
 * The upload/queue/sync unions belonged to the teacher-era offline-upload product and were
 * removed with it.
 */

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
